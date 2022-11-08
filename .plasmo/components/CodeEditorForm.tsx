import CodeEditor from '@uiw/react-textarea-code-editor';

function CodeEditorForm(props) {
  return (
    <CodeEditor
      autoFocus
      value={props.snippet}
      onChange={(evn) => {
        props.setFormSnippetDetails({
          ...props.formSnippetDetails,
          snippet: evn.target.value
        });
      }}
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

export default CodeEditorForm