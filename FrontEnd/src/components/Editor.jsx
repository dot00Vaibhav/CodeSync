import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import ACTIONS from '../Actions';

const Editor = ({socketRef, roomId, onCodeChange}) => {

  const editorRef = useRef(null);

  useEffect(() => {
    const editor = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
      mode: {name: 'javascript', json: true},
      theme: 'dracula',
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      extraKeys: {
        'Ctrl-/': 'toggleComment',
        'Cmd-/': 'toggleComment', // For macOS
      },
    })

    editorRef.current = editor;
    
    editor.setSize('100%', '100%');


    editorRef.current.on('change', (instance, changes) => {
      console.log('changes', changes);
      const {origin} = changes;
      const code = instance.getValue();
      onCodeChange(code);
      if(origin !== 'setValue'){
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
      console.log(code);
    });

  }, [])


  useEffect(() => {

    if(socketRef.current){
      socketRef.current.on(ACTIONS.CODE_CHANGE, (data) => { //data is an object
        if(data.code !== null){
          editorRef.current.setValue(data.code);
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
    
  }, [socketRef.current]);


  return (
    <div className="editorWrapper" style={{ height: '100%' }}>
      <textarea id='realtimeEditor'></textarea>
    </div>
  )
}

export default Editor;



// import React from 'react';
// import MonacoEditor from '@monaco-editor/react';

// const Editor = ({
//   defaultLanguage = 'javascript',
//   defaultValue = '// Your code goes here',
// }) => {
//   const handleEditorChange = (value) => {
//     console.log('Editor content:', value);
//   };

//   const handleEditorMount = (editor, monaco) => {
//     monaco.editor.defineTheme('dracula-custom', {
//       base: 'vs-dark',
//       inherit: true,
//       rules: [
//         { token: '', foreground: 'f8f8f2', background: '282a36' },
//         { token: 'comment', foreground: '6272a4' },
//         { token: 'keyword', foreground: 'ff79c6' },
//         { token: 'string', foreground: 'f1fa8c' },
//         { token: 'number', foreground: 'bd93f9' },
//         { token: 'type', foreground: '8be9fd' },
//         { token: 'function', foreground: '50fa7b' },
//         { token: 'variable', foreground: 'f8f8f2' },
//       ],
//       colors: {
//         'editor.background': '#282a36',
//         'editor.foreground': '#f8f8f2',
//         'editor.lineHighlightBackground': '#44475a',
//         'editor.selectionBackground': '#44475a88',
//         'editorCursor.foreground': '#f8f8f0',
//         'editorLineNumber.foreground': '#6272a4',
//         'editorLineNumber.activeForeground': '#f8f8f2',
//       },
//     });

//     monaco.editor.setTheme('dracula-custom');
//   };

//   return (
//     <div className="w-full h-full">
//       <MonacoEditor
//         language={defaultLanguage}
//         defaultValue={defaultValue}
//         theme="dracula-custom"
//         onMount={handleEditorMount}
//         onChange={handleEditorChange}
//         options={{
//           fontSize: 14,
//           minimap: { enabled: false },
//           automaticLayout: true,
//           scrollBeyondLastLine: false,
//         }}
//       />
//     </div>
//   );
// };

// export default Editor;
