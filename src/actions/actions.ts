"use server";

import { adminDb } from "@/db/firebase-admin";
import liveblocks from "@/lib/liveblock";
import { auth } from "@clerk/nextjs/server";
import * as z from "zod";

export const createNewDocument = async () => {
  await auth.protect();

  const { sessionClaims } = await auth();

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const email = sessionClaims?.email!;
  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Document",
  }); //error here

  await adminDb
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: email,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
};

export const deleteDocument = async (roomId: string) => {
  await auth.protect();

  try {
    // Delete document from documents collection
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const batch = adminDb.batch();

    // Delete the room reference from all users
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    // Delete the room from liveblocks
    await liveblocks.deleteRoom(roomId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting document", error);
    return { success: false };
  }
};

export const inviteUserAction = async (
  state: any,
  form: FormData,
  roomId: string
) => {
  await auth.protect();
  const email = form.get("email") as string | null;
  if (!email) {
    return {
      success: false,
    };
  }
  const isValidEmail = z.string().email().safeParse(email);
  if (isValidEmail.error) {
    return {
      success: false,
    };
  }

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

export const deleteUserAction = async (roomId: string, email: string) => {
  await auth.protect();

  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};

export const summarizeDocument = async (
  documentData: any,
  language: string
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BAISE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentData, targetLanguage: language }),
    });

    if (res.ok) {
      const { translated_text } = await res.json();
      return {
        success: true,
        summary: translated_text,
      };
    }
  } catch (error) {
    return {
      success: false,
    };
  }
};

export const chatToAI = async (documentData: any, question: string) => {
  await auth.protect();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BAISE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documentData, question }),
    });

    const data = await res.json();
    if (res.ok) {
      return {
        success: true,
        message: data.message,
      };
    }
  } catch (error) {
    console.error("Error chat to document", error);
    return {
      success: false,
    };
  }
};
