// src/pages/candidates/BulkResumeUpload.jsx
import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle2, X, CloudUpload, Users } from 'lucide-react'
import { resumeAPI, candidatesAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import styles from '../resume/ResumeUpload.module.css'

export default function BulkResumeUpload() {
  const [files, setFiles]           = useState([])
  const [uploading, setUploading]   = useState(false)
  const [result, setResult]         = useState(null)
  const fileRef                     = useRef(null)

  const handleFiles = (fileList) => {
    const pdfs = Array.from(fileList || []).filter(f => f.name.endsWith('.pdf') || f.name.endsWith('.docx'))
    if (!pdfs.length) {
      toast.error('Only PDF or DOCX files allowed')
      return
    }
    setFiles(pdfs)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!files.length) { toast.error('Select at least one resume file'); return }

    setUploading(true)
    setResult(null)

    try {
      // Fetch candidates so we can auto-map files to candidates without resumes
      const { data } = await candidatesAPI.getAll({})
      const candidates = data.results || []
      const withoutResume = candidates.filter(c => !c.resume_url)

      const toProcess = withoutResume.slice(0, files.length)

      const uploads = await Promise.all(
        toProcess.map((candidate, idx) => {
          const file = files[idx]
          if (!file) return Promise.resolve(null)
          return resumeAPI.upload(candidate.id, file)
        })
      )

      const successful = uploads.filter(Boolean).length
      setResult({ total: files.length, mapped: toProcess.length, uploaded: successful })
      toast.success(`Uploaded ${successful} resumes`) 
      setFiles([])
    } catch (err) {
      console.error(err)
      toast.error('Bulk upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Bulk Resume Upload"
        subtitle="Drop a batch of resumes and we will attach them to candidates without resumes yet"
        icon={Users}
        iconColor="linear-gradient(135deg,#4f46e5,#7c3aed)"
      />

      <div className={styles.layout}>
        <div className={styles.card}>
          <form onSubmit={handleUpload} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>Resume Files</label>
              <div
                className={styles.dropzone}
                onDragOver={e => { e.preventDefault() }}
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
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => handleFiles(e.target.files)}
                />
                {files.length ? (
                  <>
                    <div className={styles.dropzoneFile}>
                      <FileText size={22} className={styles.dropzoneFileIcon} />
                      <div>
                        <p className={styles.dropzoneFileName}>{files.length} file(s) selected</p>
                        <p className={styles.dropzoneFileSize}>
                          {files.map(f => f.name).join(', ')}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeFile}
                      onClick={e => { e.stopPropagation(); setFiles([]) }}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className={styles.dropzoneIcon}><CloudUpload size={22} /></div>
                    <p className={styles.dropzoneText}>Drop multiple resume files here, or <span>click to browse</span></p>
                    <p className={styles.dropzoneHint}>PDF, DOCX · Max 10 MB each</p>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={uploading || !files.length}
            >
              {uploading ? (
                <>
                  <Spinner size={14} /> Uploading resumes…
                </>
              ) : (
                <>
                  <Upload size={14} /> Upload {files.length || ''} resumes
                </>
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <CheckCircle2 size={16} className={styles.resultIcon} />
              <span>Bulk upload summary</span>
            </div>
            <pre className={styles.pre}>
{JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
