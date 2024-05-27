import styles from './page.module.css';

import SpellingBee from '@/pages/SpellingBee/SpellingBee';

export default function Home() {
  return (
    <main className={styles.container}>
      <SpellingBee />
    </main>
  );
}
