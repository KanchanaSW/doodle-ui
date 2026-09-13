"use client";

import { Button, useSketchSeed } from "doodle-ui";

export function ShuffleButton({
  size = "md",
  variant = "primary",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "ghost";
}) {
  const { shuffle } = useSketchSeed();
  return (
    <Button size={size} variant={variant} onClick={shuffle}>
      Shuffle
    </Button>
  );
}
