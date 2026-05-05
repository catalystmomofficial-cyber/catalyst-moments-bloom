import './CommunityFeedBanner.css';
import communityCover from '@/assets/community-cover.jpg';

interface CommunityFeedBannerProps {
  onJoinClick?: () => void;
  members?: string;
  conversations?: string;
  hearts?: string;
  tagline?: string;
}

export const CommunityFeedBanner = ({
  onJoinClick,
  members = '2,847',
  conversations = '12,435',
  hearts = '48,921',
  tagline = 'Real moms. Real talk.',
}: CommunityFeedBannerProps) => {
  return (
    <div className="cm-banner">
      <img src={communityCover} alt="Catalyst Mom Community" className="cm-photo" />
      <div className="cm-vignette" />
      <div className="cm-warmth" />

      <button type="button" className="cm-join-btn" onClick={onJoinClick}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        JOIN DISCUSSIONS
      </button>

      {[...Array(12)].map((_, i) => (
        <span key={i} className={`cm-sparkle sp${i + 1}`} />
      ))}

      <div className="cm-stats">
        <div className="cm-stat">
          <span className="cm-stat-num">{members}</span>
          <span className="cm-stat-label">Members</span>
        </div>
        <div className="cm-stat">
          <span className="cm-stat-num">{conversations}</span>
          <span className="cm-stat-label">Conversations</span>
        </div>
        <div className="cm-stat">
          <span className="cm-stat-num">{hearts}</span>
          <span className="cm-stat-label">Hearts</span>
        </div>
        <div className="cm-stat">
          <span className="cm-stat-num">{tagline}</span>
          <span className="cm-stat-label">Catalyst Mom</span>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeedBanner;
