import { useState, useEffect } from "react"
import CodeEditor from '@uiw/react-textarea-code-editor';

function MainEditor(props) {
  const [code, setCode] = useState(props.snippet);

  useEffect(() => {
    if(props.formSnippetDetails && props.formSnippetDetails) {
      props.setFormSnippetDetails({
        ...props.formSnippetDetails,
        snippet: code
      });
    }
  }, [code]);

  return (
    <CodeEditor
      autoFocus
      value={code}
      // onChange={code => setCode(code)}
      onChange={(evn) => setCode(evn.target.value)}
      padding={10}
      language="js"
      placeholder={"Please enter code snippet here..."}
      style={{
        fontFamily: '"Inter", "Fira Mono", monospace',
        fontSize: '1.4rem',
        minHeight: '80px',
        backgroundColor: "black",
        borderRadius: "10px"
      }}
    />
  );
}

export default MainEditor