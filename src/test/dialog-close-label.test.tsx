import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

afterEach(cleanup);

describe("shared dialog close label", () => {
  it.each([undefined, "关闭", "ปิด", "Tutup"])("supports %s without changing existing defaults", (closeLabel) => {
    render(
      <Dialog open>
        <DialogContent closeLabel={closeLabel}>
          <DialogTitle>Consultation</DialogTitle>
          <DialogDescription>Choose a contact method.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("button", { name: closeLabel ?? "Close" })).toBeVisible();
    expect(screen.getByRole("dialog")).not.toHaveAttribute("closeLabel");
  });
});
