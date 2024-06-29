import React, { useState, useContext, useEffect, useRef } from "react";
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(noteContext);
  const { notes, getAllNote, editNote } = context;
  let navigate = useNavigate();
  const [note, setNote] = useState({
    id: "",
    edittitle: "",
    editdescription: "",
    edittag: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getAllNote();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      edittitle: currentNote.title,
      editdescription: currentNote.description,
      edittag: currentNote.tag,
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log("Updating the note...", note);
    editNote(note.id, note.edittitle, note.editdescription, note.edittag);
    refClose.current.click();
    props.showAlert("success", "Notes Updated Successfully!");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert={props.showAlert} />

      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="edittitle" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edittitle"
                  name="edittitle"
                  value={note.edittitle}
                  onChange={onChange}
                  minLength={5}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editdescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="editdescription"
                  name="editdescription"
                  rows="3"
                  value={note.editdescription}
                  onChange={onChange}
                  minLength={5}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="edittag" className="form-label">
                  Tag
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="edittag"
                  name="edittag"
                  value={note.edittag}
                  onChange={onChange}
                  minLength={5}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                disabled={
                  note.edittitle.length < 5 || note.editdescription.length < 5
                }
                onClick={handleClick}
                type="button"
                className="btn btn-primary"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container">
          {notes.length === 0 && `No Notes to Display`}
        </div>
        {notes.map((note) => {
          return (
            <NoteItem
              key={note._id}
              note={note}
              updateNote={updateNote}
              showAlert={props.showAlert}
            />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
