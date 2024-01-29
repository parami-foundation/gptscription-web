import React, { useEffect } from 'react';
import styles from './style.less';
import MDEditor from '@uiw/react-md-editor';

const Privacy: React.FC = () => {
  const [privacy, setPrivacy] = React.useState<string>('');

  useEffect(() => {
    ; (async () => {
      const res = await fetch('/gpt_scription_privacy_policy.md');
      if (res.ok) {
        const text = await res.text();
        setPrivacy(text);
      }
    })();
  }, []);

  return (
    <div className={styles.privacyContainer}>
      <div className={styles.privacyWrapper}>
        <MDEditor.Markdown
          source={
            privacy
          }
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: 'transparent',
          }}
          className={styles.privacyContent}
        />
      </div>
    </div>
  )
};

export default Privacy;
