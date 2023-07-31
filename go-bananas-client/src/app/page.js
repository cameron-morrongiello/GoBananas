"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./page.module.scss";

export default function Page() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emptySubmit, setEmptySubmit] = useState(false);

  const fetchResults = async () => {
    if (!input) {
      setEmptySubmit(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/goBananas?word=${input}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="container">
        <div className="contentWrapper">
          <InputContent
            value={input}
            setInput={setInput}
            emptySubmit={emptySubmit}
            lock={results || loading}
          />
          {results ? (
            <>
              <ResultsContent response={results.response} />
              <RestartOrShare
                id={results.id}
                setResults={setResults}
                setInput={setInput}
              />
            </>
          ) : (
            <div className={styles.submitWrapper}>
              <div className={styles.absWrapper}> {loading && <Loader />} </div>

              <SubmitButton fetchResults={fetchResults} loading={loading} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const Loader = () => {
  return (
    <Image
      width={100}
      height={95.63}
      priority
      src="/bananas-loading.png"
      alt="loading bananas"
      className={styles.loader}
    />
  );
};

export const InputContent = ({ setInput, emptySubmit, lock, value }) => {
  return (
    <div className={styles.inputWrapper}>
      <div>Explain&nbsp;</div>
      <div className={styles.inputGroup}>
        <input
          className={emptySubmit ? styles.error : undefined}
          autoFocus
          type="text"
          disabled={lock}
          value={value}
          onInput={(e) => setInput(e.target.value)}
        ></input>
        <div className={styles.alignComma}>,&nbsp;</div>
      </div>
      <div>but use bananas...</div>
    </div>
  );
};

const SubmitButton = ({ fetchResults, loading }) => {
  return (
    <button
      className={loading ? styles.hiddenButton : undefined}
      onClick={fetchResults}
    >
      Go bananas!
    </button>
  );
};

export const ResultsContent = ({ response }) => {
  return (
    <div className={styles.resultsContent}>
      <div className={styles.resultsText}>{response}</div>
    </div>
  );
};

const RestartOrShare = ({ id, setResults, setInput }) => {
  const handleRestart = () => {
    setResults(null);
    setInput("");
  };

  return (
    <div className={styles.restartOrShareWrapper}>
      <button className={styles.restartButton} onClick={handleRestart}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 43 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40.3667 25.3367C39.7787 25.1534 39.1422 25.21 38.5959 25.4941C38.0495 25.7783 37.6376 26.2668 37.45 26.8533C36.3477 30.2238 34.1986 33.1546 31.3156 35.2193C28.4325 37.284 24.9659 38.3749 21.42 38.3333C17.0341 38.3832 12.8075 36.6917 9.66694 33.6299C6.52635 30.568 4.72816 26.3857 4.66667 22C4.72816 17.6143 6.52635 13.432 9.66694 10.3701C12.8075 7.30828 17.0341 5.61683 21.42 5.66668C25.381 5.65711 29.2201 7.03589 32.27 9.56335L27.2067 8.72335C26.9032 8.67341 26.5929 8.68396 26.2935 8.75439C25.9941 8.82481 25.7117 8.95372 25.4623 9.1337C25.2129 9.31368 25.0016 9.54118 24.8404 9.80312C24.6793 10.0651 24.5715 10.3563 24.5233 10.66C24.4734 10.9635 24.484 11.2738 24.5544 11.5732C24.6248 11.8725 24.7537 12.155 24.9337 12.4044C25.1137 12.6538 25.3412 12.8651 25.6031 13.0262C25.8651 13.1874 26.1563 13.2951 26.46 13.3433L36.3533 14.9767H36.75C37.0206 14.9764 37.289 14.929 37.5433 14.8367C37.6288 14.8042 37.7078 14.7568 37.7767 14.6967C37.944 14.6345 38.1012 14.548 38.2433 14.44L38.4533 14.1833C38.4533 14.0667 38.6633 13.9733 38.7567 13.8333C38.85 13.6933 38.7567 13.6 38.8733 13.5067C38.9378 13.3708 38.9924 13.2304 39.0367 13.0867L40.7867 3.75335C40.8449 3.44693 40.8422 3.13204 40.7787 2.82667C40.7152 2.5213 40.5922 2.23142 40.4167 1.97358C40.2412 1.71574 40.0167 1.495 39.7558 1.32395C39.495 1.1529 39.2031 1.0349 38.8967 0.97668C38.5902 0.91846 38.2754 0.921165 37.97 0.984638C37.6646 1.04811 37.3747 1.17111 37.1169 1.34661C36.5962 1.70106 36.2376 2.24784 36.12 2.86668L35.49 6.25001C31.584 2.86491 26.5887 1.00102 21.42 1.00001C15.7965 0.950237 10.3829 3.13337 6.36721 7.07037C2.35147 11.0074 0.0615787 16.3766 0 22C0.0615787 27.6234 2.35147 32.9927 6.36721 36.9297C10.3829 40.8666 15.7965 43.0498 21.42 43C25.9773 43.07 30.4367 41.675 34.1416 39.0202C37.8465 36.3654 40.6012 32.5913 42 28.2533C42.0885 27.9546 42.1163 27.6412 42.0817 27.3315C42.0471 27.0219 41.9509 26.7223 41.7986 26.4504C41.6464 26.1786 41.4413 25.94 41.1953 25.7487C40.9494 25.5574 40.6676 25.4173 40.3667 25.3367Z"
            fill="white"
          />
        </svg>
      </button>
      <button
        onClick={() =>
          navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_APP_DOMAIN}/b/${id}`
          )
        }
      >
        Copy Share Link
      </button>
    </div>
  );
};
