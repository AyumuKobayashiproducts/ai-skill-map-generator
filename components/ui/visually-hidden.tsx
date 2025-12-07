import type { HTMLAttributes, ReactNode } from "react";

interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

/**
 * 視覚的に隠すが、スクリーンリーダーには読み上げられるテキスト
 * アクセシビリティ向上のため、アイコンのみのボタンなどに使用
 * 
 * @example
 * <button>
 *   <IconTrash />
 *   <VisuallyHidden>削除</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden({ children, ...props }: VisuallyHiddenProps) {
  return (
    <span
      {...props}
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: "0",
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: "0"
      }}
    >
      {children}
    </span>
  );
}




