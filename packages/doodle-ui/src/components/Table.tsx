"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  type TableHTMLAttributes,
} from "react";
import {
  DRAW_IN_DURATION_MS,
  TABLE_STAGGER_MS,
  useAnimate,
  useDrawIn,
} from "../animations";
import { useResolvedSeed } from "../hooks/useResolvedSeed";
import { RoughSvg } from "../primitives/RoughSvg";
import { SKETCH_COLORS, type SketchProps } from "../types";
import { assignRef, cn, deriveSeed, doodleUiFontFamily, doodleUiFontWeight } from "../utils";

interface TableSketchContextValue extends SketchProps {
  resolvedSeed: number;
  ink: string;
  shouldAnimate: boolean;
}

const TableSketchContext = createContext<TableSketchContextValue | null>(null);

function useTableSketch(): TableSketchContextValue {
  const ctx = useContext(TableSketchContext);
  if (!ctx) {
    throw new Error("Table parts must be used inside <Table>.");
  }
  return ctx;
}

export interface TableProps
  extends Omit<TableHTMLAttributes<HTMLTableElement>, "color">,
    SketchProps {
  headerUnderline?: boolean;
  children?: ReactNode;
  /**
   * Draw-in row rules on mount, staggered slightly. Defaults to the
   * DoodleUIProvider value (true).
   */
  animate?: boolean;
}

interface RowLine {
  y: number;
  width: number;
  key: string;
  header: boolean;
  index: number;
}

function TableRule({
  line,
  headerUnderline,
  roughness,
  resolvedSeed,
  ink,
  bowing,
  strokeWidth,
  shouldAnimate,
}: {
  line: RowLine;
  headerUnderline: boolean;
  roughness?: number;
  resolvedSeed: number;
  ink: string;
  bowing?: number;
  strokeWidth?: number;
  shouldAnimate: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const delay = shouldAnimate
    ? Math.min(line.index, 6) * TABLE_STAGGER_MS
    : 0;
  useDrawIn(ref, DRAW_IN_DURATION_MS, shouldAnimate, undefined, delay);

  if (line.header && !headerUnderline) return null;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        width: line.width,
        top: line.y - 6,
        height: 12,
      }}
    >
      <RoughSvg
        shape="line"
        roughness={
          line.header ? (roughness ?? 1.5) + 0.2 : roughness ?? 1.7
        }
        seed={deriveSeed(resolvedSeed, line.key)}
        sketchColor={ink}
        bowing={bowing ?? (line.header ? 1.4 : 2)}
        strokeWidth={
          line.header
            ? (strokeWidth ?? 1.75) + 0.35
            : strokeWidth ?? 1.35
        }
        inset={6}
      />
    </div>
  );
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    className,
    style,
    children,
    headerUnderline = true,
    roughness,
    seed,
    sketchColor,
    bowing,
    fillStyle,
    strokeWidth,
    animate,
    ...rest
  },
  ref,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [lines, setLines] = useState<RowLine[]>([]);
  const resolvedSeed = useResolvedSeed(seed);
  const ink = sketchColor ?? SKETCH_COLORS.ink;
  const shouldAnimate = useAnimate(animate);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const table = tableRef.current;
    if (!wrapper || !table) return;

    const measure = () => {
      const rows = Array.from(table.querySelectorAll("tr"));
      const next: RowLine[] = [];
      rows.forEach((row, index) => {
        const isLast = index === rows.length - 1;
        const isHeader = row.parentElement?.tagName === "THEAD";
        if (isLast && !isHeader) return;
        next.push({
          y: row.offsetTop + row.offsetHeight,
          width: table.offsetWidth,
          key: isHeader ? `header-${index}` : `row-${index}`,
          header: Boolean(isHeader),
          index,
        });
      });
      setLines(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(table);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [children]);

  return (
    <TableSketchContext.Provider
      value={{
        roughness,
        seed: resolvedSeed,
        sketchColor,
        bowing,
        fillStyle,
        strokeWidth,
        resolvedSeed,
        ink,
        shouldAnimate,
      }}
    >
      <div
        ref={wrapperRef}
        className={cn(className)}
        style={{ position: "relative", width: "100%", ...style }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "visible",
          }}
        >
          {lines.map((line) => (
            <TableRule
              key={line.key}
              line={line}
              headerUnderline={headerUnderline}
              roughness={roughness}
              resolvedSeed={resolvedSeed}
              ink={ink}
              bowing={bowing}
              strokeWidth={strokeWidth}
              shouldAnimate={shouldAnimate}
            />
          ))}
        </div>
        <table
          ref={(node) => {
            tableRef.current = node;
            assignRef(ref, node);
          }}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            position: "relative",
            zIndex: 0,
            fontFamily: doodleUiFontFamily,
            color: ink,
          }}
          {...rest}
        >
          {children}
        </table>
      </div>
    </TableSketchContext.Provider>
  );
});

export const TableHead = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableHead({ className, style, ...rest }, ref) {
  return (
    <thead
      ref={ref}
      className={cn(className)}
      style={style}
      {...rest}
    />
  );
});

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(function TableBody({ className, style, ...rest }, ref) {
  return (
    <tbody
      ref={ref}
      className={cn(className)}
      style={style}
      {...rest}
    />
  );
});

export const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(function TableRow({ className, style, ...rest }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(className)}
      style={style}
      {...rest}
    />
  );
});

export interface TableHeaderCellProps
  extends Omit<ThHTMLAttributes<HTMLTableCellElement>, "color"> {}

export const TableHeaderCell = forwardRef<
  HTMLTableCellElement,
  TableHeaderCellProps
>(function TableHeaderCell({ className, style, children, ...rest }, ref) {
  useTableSketch();
  return (
    <th
      ref={ref}
      className={cn(className)}
      style={{
        textAlign: "left",
        fontWeight: doodleUiFontWeight(650),
        fontSize: 13,
        padding: "10px 12px",
        ...style,
      }}
      {...rest}
    >
      {children}
    </th>
  );
});

export interface TableCellProps
  extends Omit<TdHTMLAttributes<HTMLTableCellElement>, "color"> {}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className, style, children, ...rest }, ref) {
    useTableSketch();
    return (
      <td
        ref={ref}
        className={cn(className)}
        style={{
          fontSize: 14,
          padding: "10px 12px",
          ...style,
        }}
        {...rest}
      >
        {children}
      </td>
    );
  },
);
