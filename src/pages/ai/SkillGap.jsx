// src/pages/ai/SkillGap.jsx
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Search,
  Brain,
  Sparkles,
  FileText,
} from 'lucide-react';
import { aiAPI } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import styles from './AIPages.module.css';

export default function SkillGap() {
  const [params] = useSearchParams();
  const [candidateId, setCandidateId] = useState(params.get('candidate') || '');
  const [gapResult, setGapResult] = useState(null);
  const [reportResult, setReportResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGapResult(null);
    setReportResult(null);

    try {
      // Call both Skill Gap and AI Report APIs
      const [gapRes, reportRes] = await Promise.all([
        aiAPI.skillGap(candidateId),
        aiAPI.aiReport(candidateId),
      ]);

      setGapResult(gapRes.data);
      setReportResult(reportRes.data);
    } catch {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Skill Gap & AI Report"
        subtitle="Analyze skills and generate AI hiring recommendation from a single Candidate ID"
        icon={TrendingUp}
        iconColor="linear-gradient(135deg,#0891b2,#0e7490)"
      />

      <div className={styles.card}>
        <form onSubmit={analyze} className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={14} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Enter Candidate ID…"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.actionBtn} disabled={loading}>
            {loading ? (
              <Spinner size={14} />
            ) : (
              <>
                <TrendingUp size={14} /> Analyze
              </>
            )}
          </button>
        </form>
      </div>

      {loading && (
        <div className={styles.loadingState}>
          <Spinner size={24} />
          <p>Running AI skill and report analysis…</p>
        </div>
      )}

      {!loading && (gapResult || reportResult) && (
        <div className={styles.resultsGrid}>
          {/* Skill Gap Analysis */}
          {gapResult && (
            <div className={styles.results}>
              {gapResult.matched_skills?.length > 0 && (
                <div className={styles.resultSection}>
                  <div className={styles.resultSectionHeader}>
                    <CheckCircle2
                      size={15}
                      style={{ color: 'var(--color-success)' }}
                    />
                    <span>Matched Skills</span>
                    <span className={styles.resultCount}>
                      {gapResult.matched_skills.length}
                    </span>
                  </div>
                  <div className={styles.chipGrid}>
                    {gapResult.matched_skills.map((s) => (
                      <span
                        key={s}
                        className={`${styles.chip} ${styles.chipSuccess}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {gapResult.missing_skills?.length > 0 && (
                <div className={styles.resultSection}>
                  <div className={styles.resultSectionHeader}>
                    <XCircle
                      size={15}
                      style={{ color: 'var(--color-error)' }}
                    />
                    <span>Missing Skills</span>
                    <span className={styles.resultCount}>
                      {gapResult.missing_skills.length}
                    </span>
                  </div>
                  <div className={styles.chipGrid}>
                    {gapResult.missing_skills.map((s) => (
                      <span
                        key={s}
                        className={`${styles.chip} ${styles.chipError}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {gapResult.recommendation && (
                <div className={styles.recommendation}>
                  <Lightbulb
                    size={15}
                    style={{ color: '#d97706', flexShrink: 0 }}
                  />
                  <p>{gapResult.recommendation}</p>
                </div>
              )}

              {gapResult.learning_path?.length > 0 && (
                <div className={styles.resultSection}>
                  <div className={styles.resultSectionHeader}>
                    <Sparkles size={15} style={{ color: '#2563eb' }} />
                    <span>Suggested Learning Path</span>
                  </div>
                  <ul className={styles.learningList}>
                    {gapResult.learning_path.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* AI Report */}
          {reportResult && (
            <div className={styles.reportCard}>
              <div className={styles.reportHeader}>
                <Brain size={15} />
                <span>AI Candidate Report</span>
              </div>
              <div className={styles.reportBody}>
                {reportResult.report ||
                  JSON.stringify(reportResult, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}