import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase/db";
import Link from "next/link";

import { InputContent } from "@/app/page";
import { ResultsContent } from "@/app/page";

import styles from "./page.module.scss";

export async function generateMetadata({ params }) {
  const { id } = params;
  const docRef = doc(db, "bananaResponses", id);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    var title = docSnapshot.data().word;
    return {
      title: `${title} | Explain But Use Bananas`,
    };
  } else {
    return {
      title: `Not Found | Explain But Use Bananas`,
    };
  }
}

export default async function Page({ params }) {
  const { id } = params;
  const docRef = doc(db, "bananaResponses", id);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    var data = docSnapshot.data();
  } else {
    // TODO: make 404 page
    return <div>Not Found</div>;
  }

  return (
    <main className="main">
      <div className="container">
        <div className="contentWrapper">
          <InputContent value={data.word} lock={true} />
          <ResultsContent response={data.response} />
          <div className={styles.linkWrapper}>
            <Link className={styles.linkText} href="/">
              🍌 Explain, but use bananas...
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 0;
