import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { resumeAPI, candidatesAPI } from '@/lib/api'
import PageHeader from '@/components/ui/PageHeader'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function ResumeUpload() {
  const [candidateId, setCandidateId] = useState('')
  const [file, setFile]               = useState(null)
  const [uploading, setUploading]     = useState(false)
  const [parsed, setParsed]           = useState(null)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !candidateId) { toast.error('Select a candidate and a file'); return }
    setUploading(true)
    try {
      const upRes = await resumeAPI.upload(candidateId, file)
      toast.success('Resume uploaded!')
      const parseRes = await resumeAPI.parse(upRes.data.id)
      setParsed(parseRes.data)
      toast.success('Resume parsed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
    } finally { setUploading(false) }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <PageHeader title="Resume Upload" subtitle="Upload and auto-parse a candidate's resume using AI" />
      <div className="card">
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="form-group">
            <label className="label">Candidate ID</label>
            <input className="input" placeholder="Enter candidate ID" value={candidateId} onChange={e => setCandidateId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">Resume File (PDF / DOCX)</label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-8)', background: 'var(--color-surface-2)', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
              <FileText size={32} style={{ color: 'var(--color-primary)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{file ? file.name : 'Click to choose a file'}</span>
              <input type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? <Spinner size={14} /> : <><Upload size={14} /> Upload & Parse</>}
          </button>
        </form>

        {parsed && (
          <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Parsed Data</h3>
            <pre style={{ fontSize: 'var(--text-xs)', background: 'var(--color-surface-2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', overflow: 'auto', maxHeight: 300 }}>{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
