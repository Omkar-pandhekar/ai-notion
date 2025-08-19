"use client";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { createNewDocument } from "../../actions/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./ui/alert-dialog";

const NewDocumentButton = () => {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateNewDocument = () => {
    if (!isSignedIn) {
      setIsOpen(true);
      return;
    }

    startTransition(async () => {
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  return (
    <>
      <Button onClick={handleCreateNewDocument} disabled={isPending}>
        {isPending ? "Creating..." : "New Document"}
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button style={{ display: "none" }} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please Sign In</AlertDialogTitle>
            <AlertDialogDescription>
              You need to sign in to create a new document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NewDocumentButton;
