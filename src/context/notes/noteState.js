import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  //   const s1 = {
  //     "name": "Harsh",
  //     "class": "2024",
  //   };

  //   const [state, setState] = useState(s1);

  //   const update = () => {
  //     setTimeout(() => {
  //       setState({
  //         "name": "Golu",
  //         "class": "2030",
  //       });
  //     }, 3000);
  //   };

  const host = "http://localhost:5000";

  //   const notesInitial = [];

  const [notes, setNotes] = useState([]);

  // Get all notes
  const getAllNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  // Add a note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    console.log("Adding a new note");
    const note = json;

    setNotes(notes.concat(note));
  };

  // Delete note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);

    console.log("Delete this note with id: " + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].tag = tag;
        newNotes[index].description = description;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, getAllNote, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
