// src/components/ui/TnCModal.jsx
import { useEffect, useRef } from 'react'
import { X, Shield, FileText } from 'lucide-react'
import styles from './TnCModal.module.css'

/**
 * TnCModal
 * Props:
 *   open     {boolean}  — whether modal is visible
 *   tab      {'tnc'|'privacy'}  — which tab to show by default
 *   onClose  {() => void}
 *   onAccept {() => void}  — called when user clicks "I Accept"
 */
export default function TnCModal({ open, tab = 'tnc', onClose, onAccept }) {
  const modalRef = useRef(null)
  const closeRef = useRef(null)

  // Trap focus & close on Escape
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tnc-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.modal} ref={modalRef}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon} aria-hidden="true">
              {tab === 'tnc'
                ? <FileText size={18} strokeWidth={2} />
                : <Shield size={18} strokeWidth={2} />}
            </span>
            <h2 className={styles.title} id="tnc-modal-title">
              {tab === 'tnc' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h2>
          </div>
          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab bar */}
        <div className={styles.tabs} role="tablist">
          <TnCModalInner defaultTab={tab} onAccept={onAccept} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}

function TnCModalInner({ defaultTab, onAccept, onClose }) {
  const tabRef = useRef(defaultTab)
  const [activeTab, setActiveTab] = [tabRef.current, (t) => { tabRef.current = t; _rerender() }]
  const [, _rerender] = useRerender()

  return (
    <>
      <div className={styles.tabBar}>
        <button
          role="tab"
          aria-selected={tabRef.current === 'tnc'}
          className={`${styles.tabBtn} ${tabRef.current === 'tnc' ? styles.tabActive : ''}`}
          onClick={() => { tabRef.current = 'tnc'; _rerender() }}
        >
          <FileText size={13} strokeWidth={2} /> Terms &amp; Conditions
        </button>
        <button
          role="tab"
          aria-selected={tabRef.current === 'privacy'}
          className={`${styles.tabBtn} ${tabRef.current === 'privacy' ? styles.tabActive : ''}`}
          onClick={() => { tabRef.current = 'privacy'; _rerender() }}
        >
          <Shield size={13} strokeWidth={2} /> Privacy Policy
        </button>
      </div>

      <div className={styles.body}>
        {tabRef.current === 'tnc' ? <TnCContent /> : <PrivacyContent />}
      </div>

      <div className={styles.footer}>
        <button className={styles.declineBtn} onClick={onClose}>Decline</button>
        <button className={styles.acceptBtn} onClick={onAccept}>I Accept</button>
      </div>
    </>
  )
}

function useRerender() {
  const [count, setCount] = [0, null]
  const { useState } = require !== undefined ? require('react') : {}
  return useState ? useState(0) : [0, () => {}]
}

/* ─── Terms & Conditions content ─── */
function TnCContent() {
  return (
    <div className={styles.content}>
      <p className={styles.lastUpdated}>Last updated: July 2026</p>

      <h3>1. Acceptance of Terms</h3>
      <p>By creating an account on SaarthiIQ, you agree to be bound by these Terms and Conditions. If you do not agree, please do not register.</p>

      <h3>2. Use of the Platform</h3>
      <p>SaarthiIQ is an AI-powered recruitment intelligence platform. You agree to use the platform only for lawful recruitment and HR purposes.</p>
      <ul>
        <li>You must not upload false, misleading, or unlawful candidate data.</li>
        <li>You must not attempt to reverse-engineer or misuse our AI models.</li>
        <li>You are responsible for all activities performed under your account.</li>
      </ul>

      <h3>3. Account Responsibilities</h3>
      <p>You are responsible for maintaining the confidentiality of your login credentials. Notify us immediately at <strong>support@saarthiiq.com</strong> if you suspect unauthorized access.</p>

      <h3>4. Data Ownership</h3>
      <p>You retain ownership of the candidate data you upload. By using the platform, you grant SaarthiIQ a limited license to process that data solely to provide our services.</p>

      <h3>5. Prohibited Activities</h3>
      <p>You may not use SaarthiIQ to discriminate against candidates on the basis of race, gender, age, religion, disability, or any other protected characteristic.</p>

      <h3>6. Intellectual Property</h3>
      <p>All platform features, AI models, UI designs, and brand assets are the intellectual property of SaarthiIQ. Unauthorized reproduction is prohibited.</p>

      <h3>7. Termination</h3>
      <p>We reserve the right to suspend or terminate accounts that violate these terms, without prior notice.</p>

      <h3>8. Limitation of Liability</h3>
      <p>SaarthiIQ is provided "as is". We are not liable for indirect, incidental, or consequential damages arising from use of the platform.</p>

      <h3>9. Changes to Terms</h3>
      <p>We may update these terms from time to time. Continued use after changes constitutes your acceptance of the revised terms.</p>

      <h3>10. Contact</h3>
      <p>For questions about these terms, email us at <strong>legal@saarthiiq.com</strong>.</p>
    </div>
  )
}

/* ─── Privacy Policy content ─── */
function PrivacyContent() {
  return (
    <div className={styles.content}>
      <p className={styles.lastUpdated}>Last updated: July 2026</p>

      <h3>1. Information We Collect</h3>
      <p>We collect information you provide during registration (name, email, password) and information generated through platform usage (job postings, candidate profiles, interview records).</p>

      <h3>2. How We Use Your Information</h3>
      <ul>
        <li>To provide and improve our recruitment platform services.</li>
        <li>To process AI-powered candidate matching and resume analysis.</li>
        <li>To send account notifications and product updates (you can opt out).</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h3>3. Data Storage & Security</h3>
      <p>Your data is stored on secure, encrypted servers. We use industry-standard practices including TLS in transit and AES-256 at rest. We do not sell your data to third parties.</p>

      <h3>4. Cookies</h3>
      <p>We use essential cookies for authentication and session management. Analytics cookies are only set with your consent.</p>

      <h3>5. Third-Party Services</h3>
      <p>We may use third-party services (e.g., cloud providers, email services) that process data on our behalf under strict data processing agreements.</p>

      <h3>6. Your Rights</h3>
      <p>You have the right to access, correct, export, or delete your personal data at any time. Submit requests to <strong>privacy@saarthiiq.com</strong>.</p>

      <h3>7. Data Retention</h3>
      <p>We retain your account data for as long as your account is active. Upon account deletion, data is purged within 30 days.</p>

      <h3>8. Children's Privacy</h3>
      <p>SaarthiIQ is not intended for users under 18. We do not knowingly collect data from minors.</p>

      <h3>9. Changes to This Policy</h3>
      <p>We will notify you of material changes via email or an in-app notification before they take effect.</p>

      <h3>10. Contact Us</h3>
      <p>For privacy-related inquiries, contact us at <strong>privacy@saarthiiq.com</strong>.</p>
    </div>
  )
}
