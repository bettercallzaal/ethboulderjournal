"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HyperBlogOldDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = params?.["hyperblogId"];
    router.replace(id ? `/hyperblogs/${id}` : "/hyperblogs");
  }, [params, router]);

  return null;
}
