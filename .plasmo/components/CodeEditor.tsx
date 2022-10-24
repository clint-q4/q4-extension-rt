import { useState, useEffect } from "react"
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css'; //Example style, you can use another

function CodeEditor(props) {
  const [code, setCode] = useState(props.snippet);

  useEffect(() => {
    // if(props.formSnippetDetails && props.formSnippetDetails) {
    //   props.setFormSnippetDetails({
    //     ...props.formSnippetDetails,
    //     snippet: code
    //   })
    //     console.log(props.formSnippetDetails);
    // }
  }, [code]);

  return (
    <Editor
      value={code}
      onValueChange={code => setCode(code)}
      // onValueChange={code => setCode(code)}
      highlight={code => highlight(code, languages.js)}
      textareaId={"code-snip-editor"}
      padding={10}
      placeholder={"Please enter code snippet here..."}
      style={{
        fontFamily: '"Inter", "Fira Mono", monospace',
        fontSize: '1rem',
        minHeight: '80px'
      }}
      textareaClassName={"input codeInput"}
    />
  );
}

export default CodeEditor