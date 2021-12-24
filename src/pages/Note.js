import React, { useEffect, useState } from 'react'
//import notes from '../assets/data'
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'
import { Link } from 'react-router-dom'


const Note = ({ match, history }) => {
    let noteId = match.params.id

    let [note, setNote] = useState(null)

    //let note = notes.find(note => note.id == noteId)

    useEffect(() => {

        getNote()
    }, [noteId])

    let getNote = async () => {
        if (noteId === 'new') return
        let response = await fetch(`http://127.0.0.1:5000/notes/${noteId}`)
        let data = await response.json()
        setNote(data)
    }

    const createNote = async () => {
        await fetch(`http://127.0.0.1:5000/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //When sending data to a web server, the data has to be a string
            body: JSON.stringify({ ...note, 'updated': new Date() })
        })
    }


    const updateNote = async () => {
        await fetch(`http://127.0.0.1:5000/notes/${noteId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            //(…) with objects is used to create copies of existing objects with new or updated values
            //or to make a copy of an object with more properties
            body: JSON.stringify({ ...note, 'updated': new Date() })
        })
    }

    const deleteNote = async () => {
        await fetch(`http://127.0.0.1:5000/notes/${noteId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(note)
        })
        history.push('/')
    }

    let handleSubmit = () => {
        if (noteId !== "new" && !note.body) {
            deleteNote()
        } else if (noteId !== "new") {
            updateNote()
        } else if (noteId === 'new' && note !== null) {
            createNote()
        }

        history.push('/')
    }


    return (
        <div className="note">
            <div className="note-header">
                <h3>
                    <Link to={'/'}>
                        <ArrowLeft onClick={handleSubmit} />
                    </Link>
                </h3>
                {noteId !== 'new' ? (
                    <button onClick={deleteNote}>Delete</button>
                ) : (
                    <button onClick={handleSubmit}>Done</button>
                )}

            </div>
            <textarea onChange={(e) => { setNote({ ...note, 'body': e.target.value }) }} placeholder="Edit note" value={note?.body}></textarea>
        </div >
    )
}

export default Note
