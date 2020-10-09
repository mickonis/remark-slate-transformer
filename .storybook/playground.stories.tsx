import React, { useMemo, useRef, useState } from "react";
import { Node } from "slate";
import unified from "unified";
import markdown from "remark-parse";
import stringify from "remark-stringify";
import { remarkToSlate, slateToRemark } from "../src";
import SlateEditor from "./slate-editor";
import TextEditor from "./text-editor";
import Text from "./text";
import text from "../fixture/article.md";

const toSlateProcessor = unified()
  .use(markdown, { commonmark: true })
  .use(remarkToSlate);
const toRemarkProcessor = unified().use(slateToRemark).use(stringify);

const toSlate = (s: string) => toSlateProcessor.processSync(s).result as Node[];
const toMd = (value: Node[]) => {
  const mdast = toRemarkProcessor.runSync({
    type: "root",
    children: value,
  });
  return toRemarkProcessor.stringify(mdast);
};

export default {
  title: "playground",
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    style={useMemo(
      () => ({
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        fontSize: "10.5pt",
      }),
      []
    )}
  >
    {children}
  </div>
);

export const MarkdownToSlate = () => {
  const [value, setValue] = useState(toSlate(text));
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <Wrapper>
      <TextEditor ref={ref} initialValue={text} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setValue(toSlate(ref.current.value));
          }}
        >
          {"md -> slate"}
        </button>
      </div>
      <SlateEditor ref={useRef(null)} initialValue={value} />
    </Wrapper>
  );
};

export const MarkdownToSlateJson = () => {
  const [value, setValue] = useState(toSlate(text));
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <Wrapper>
      <TextEditor ref={ref} initialValue={text} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setValue(toSlate(ref.current.value));
          }}
        >
          {"md -> slate"}
        </button>
      </div>
      <Text>{JSON.stringify(value, null, 2)}</Text>
    </Wrapper>
  );
};

export const SlateToMarkdown = () => {
  const [value, setValue] = useState(toSlate(text));
  const [md, setMd] = useState(toMd(value));
  const ref = useRef<Node[]>(null);
  return (
    <Wrapper>
      <SlateEditor ref={ref} initialValue={value} />
      <div style={{ padding: 10 }}>
        <button
          style={{ height: "100%" }}
          onClick={() => {
            if (!ref.current) return;
            setMd(toMd(ref.current));
          }}
        >
          {"slate -> md"}
        </button>
      </div>
      <Text>{md}</Text>
    </Wrapper>
  );
};
