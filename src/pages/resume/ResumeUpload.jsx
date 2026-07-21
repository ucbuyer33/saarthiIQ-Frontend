// src/pages/resume/ResumeUpload.jsx
import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle2, X, CloudUpload } from 'lucide-react'
import { resumeAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from './ResumeUpload.module.css'

export default function ResumeUpload() {
  const [candidateId, setCandidateId] = useState('')
  const [file, setFile]               = useState(null)
  const [dragging, setDragging]       = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [parsed, setParsed]           = useState(null)
  const fileRef                       = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.name.endsWith('.pdf') || f.name.endsWith('.docx'))) setFile(f)
    else toast.error('Only PDF or DOCX files allowed')
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !candidateId) { toast.error('Select a candidate and a file'); return }
    setUploading(true)
    setParsed(null)
    try {
      const upRes    = await resumeAPI.upload(candidateId, file)
      toast.success('Resume uploaded!')
      const parseRes = await resumeAPI.parse(upRes.data.id)
      setParsed(parseRes.data)
      toast.success('Parsed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
    } finally { setUploading(false) }
  }

  return (
    <div className={styles.page}>

      <PageHeader
        title="Resume Upload"
        subtitle="Upload and auto-parse a candidate's resume using AI"
        icon={CloudUpload}
        iconColor="linear-gradient(135deg,#6366f1,#4f46e5)"
      />

      <div className={styles.layout}>
        <div className={styles.card}>
          <form onSubmit={handleUpload} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Candidate ID <span className={styles.req}>*</span></label>
              <input
                className={styles.input}
                placeholder="e.g. 42"
                value={candidateId}
                onChange={e => setCandidateId(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Resume File <span className={styles.hint}>PDF or DOCX</span></label>
              <div
                className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''} ${file ? styles.dropzoneFilled : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx"
                  style={{ display: 'none' }}
                  onChange={e => setFile(e.target.files[0])}
                />
                {file ? (
                  <>
                    <div className={styles.dropzoneFile}>
                      <FileText size={22} className={styles.dropzoneFileIcon} />
                      <div>
                        <p className={styles.dropzoneFileName}>{file.name}</p>
                        <p className={styles.dropzoneFileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeFile}
                      onClick={e => { e.stopPropagation(); setFile(null) }}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles.dropzoneIcon}><Upload size={22} /></div>
                    <p className={styles.dropzoneText}>Drop your file here, or <span>click to browse</span></p>
                    <p className={styles.dropzoneHint}>PDF, DOCX · Max 10 MB</p>
                  </>
                )}
              </div>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={uploading || !file || !candidateId}>
              {uploading
                ? <><Spinner size={14} /> Uploading &amp; Parsing…</>
                : <><Upload size={14} /> Upload &amp; Parse</>}
            </button>
          </form>
        </div>
        {parsed && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <CheckCircle2 size={16} className={styles.resultIcon} />
              <span>Parsed Data</span>
            </div>
            <pre className={styles.pre}>{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
