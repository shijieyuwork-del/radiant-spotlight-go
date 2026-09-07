import { Content } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle } from "@/components/ui/dialog";
import type { PatientStory } from "@/data/patientStories";

type PatientStoryDialogProps = {
  story: PatientStory | null;
  zh: boolean;
  onClose: () => void;
  onReturnFocus: () => void;
};

const PatientStoryDialog = ({ story, zh, onClose, onReturnFocus }: PatientStoryDialogProps) => (
  <Dialog open={story !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogPortal>
      <DialogOverlay className="bg-black/50 motion-reduce:animate-none" />
      <Content
        className="fixed left-1/2 top-1/2 z-[100] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-3xl border border-border bg-card p-6 text-foreground shadow-soft focus:outline-none sm:p-10"
        lang={zh ? "zh" : "en"}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onReturnFocus();
        }}
      >
        {story && (
          <>
            <div className="pe-10">
              <span className="text-xs font-semibold text-muted-foreground">{zh ? "患者故事" : "Patient stories"}</span>
              <DialogTitle className="mt-3 font-display text-3xl font-medium leading-tight">{story.name}</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {zh ? `${story.age} 岁 · ${story.countryZh}` : `Age ${story.age} · ${story.country}`}
                {story.procedure && <span className="mt-2 block">{zh ? story.procedureZh : story.procedure}</span>}
              </DialogDescription>
            </div>
            <blockquote className="mt-7 space-y-5 text-base leading-relaxed text-foreground">
              {(zh ? story.storyZh : story.story).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </blockquote>
          </>
        )}
        <DialogClose
          className="absolute end-3 top-3 grid size-11 place-items-center rounded-full text-foreground transition-colors duration-150 hover:bg-secondary dark:hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 motion-reduce:transition-none"
          aria-label={zh ? "关闭" : "Close"}
        >
          <X className="size-5" aria-hidden="true" />
        </DialogClose>
      </Content>
    </DialogPortal>
  </Dialog>
);

export default PatientStoryDialog;
