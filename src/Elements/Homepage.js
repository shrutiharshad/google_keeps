import React, { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { Card } from 'antd';
import { Button, Flex } from 'antd';
import { Modal } from 'antd';
import { Checkbox } from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import axios from 'axios';
import { MdOutlineDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdLabelImportant } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { io } from 'socket.io-client';

axios.defaults.baseURL = 'http://localhost:3000';
const socket = io('http://localhost:3000');

const Homepage = () => {
    const [visibility, setVisibility] = useState(true)
    const [inputTitle, setTitle] = useState()
    const [inputDescription, setDescription] = useState()
    const [notes, updateNotes] = useState([])
    const [filteredNotes, updateFilteredNotes] = useState([])
    const [editObj, setEditObj] = useState({})
    const [labelInput, setLabelInput] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [labelArray, setLabelArray] = useState([]);
    const [labelChecked, setLabelChecked] = useState([])
    const [collapsed, setCollapsed] = useState(false);
    useEffect(() => {
        getFromServer()
    }, [])

    const updateToServer = (newObj) => {
        console.log("ID??????????????????", newObj._id)
        if (newObj?._id) {
            console.log("if")
            console.log('[updateToServer] update --> newObj', newObj)
            axios({ method: 'post', url: '/notes/update', data: { ...newObj, } }).then(res => getFromServer()).catch(e => console.log('error in update', e))
        } else {
            console.log("else")
            console.log('[updateToServer] add --> newObj', newObj)
            axios({ method: 'post', url: '/notes', data: { ...newObj, created_by: localStorage.getItem("Email_id") } }).then(res => getFromServer()).catch(e => console.log('error in add', e))
        }
    }

    const getFromServer = () => {
        axios({ method: 'get', url: '/notes' }).then((res) => {
            const Data = res.data;
            console.log("Data get successfully", Data);
            updateFilteredNotes(Data.notes)
            updateNotes(Data.notes)
            const allLables = Data.notes.reduce((prev, curr) => {
                curr.label.map(l => {
                    if (!prev.includes(l))
                        prev.push(l)
                })
                return prev
            }, [])
            // console.log("Filter array", allLables)
            setLabelArray(allLables)

        }).catch((e) => { console.log("Error from getting data", e) })
    }
    const deleteFromServer = (id) => {
        axios({ method: 'post', url: '/notes/delete', data: { id } }).then((res) => {
            // const Data = res.data; console.log("Data get successfully", Data);
            // updateFilteredNotes(Data.notes)
            // updateNotes(Data.notes)
            getFromServer()
        }).catch((e) => { console.log("Error from getting data", e) })
    }
    // const getLabelFromServer = () => {
    //     axios({ method: 'get', url: '/notes' }).then((res) => {
    //         const Data = res.data.label;
    //         console.log("label get successfully", Data.label);
    //         updateFilteredNotes(Data.notes)
    //         updateNotes(Data.notes)
    //     }).catch((e) => { console.log("Error from getting data", e) })
    // }
    const showModal = (editNote) => {
        console.log('111111111')
        setIsModalOpen(true);
        console.log('222222222222')
        setEditObj(editNote)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditObj(null)
    };

    const addNotes = () => {
        const update = { title: inputTitle, description: inputDescription }
        let newObj
        console.log("[addNotes] --> editObj", editObj)
        // console.log("[addNotes] --> update", update)
        if (editObj?._id) {
            newObj = notes.find(i => i._id === editObj._id)
            newObj = { ...newObj, title: inputTitle, description: inputDescription }
            console.log("[if] --> newObj", newObj);
            // updateNotes([...updateTask])
            // updateFilteredNotes([...updateTask])

        } else {
            const newNote = { id: uuidv4(), label: [], ...update, created_by: '' }
            newObj = newNote
            console.log("[else] --> newObj", newObj);
        }
        console.log(">>>>>>>>>>>>>>>>>>", newObj)
        setEditObj(null)
        setTitle("")
        setDescription("")
        updateToServer(newObj)
    }

    const Editelement = (t) => {
        setTitle(t.title)
        setDescription(t.description)
        socket.emit("Data", t)
        setVisibility(false)
        setEditObj(t);
    }

    const deleteNotes = (t) => {
        // updateNotes(remainElement)
        // updateFilteredNotes(remainElement)
        // localStorage.setItem("notes", JSON.stringify(remainElement));
        deleteFromServer(t)
    }

    const addLabelValue = (editObj) => {
        console.log('editObj', editObj)
        setIsModalOpen(false)
        setEditObj(null)
        let tempNotes = [...notes];
        console.log("Tempnotes", tempNotes)
        // let updateIndex = tempNotes.findIndex(i => i.id === id)
        // tempNotes.splice(updateIndex, 1, {
        //     id: id, title: title, description: description, label: [...labelChecked, labelInput]
        // });
        // updateNotes([...tempNotes])
        // updateFilteredNotes([...tempNotes])
        console.log('labelInput', labelInput)
        if (labelInput !== '' && labelInput !== undefined) {
            console.log('if')
            updateToServer({ ...editObj, label: [...labelChecked, labelInput] })
        } else {
            console.log('else');
            updateToServer({ ...editObj, label: [...labelChecked] })
        }
        setLabelInput("")
    }
    const saveLable = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setLabelChecked(checkedValues)
    };
    const addingElement = Array.isArray(filteredNotes) ? filteredNotes.map((t) => {
        return <div><Flex><Card
            className="cards"
            title={t.title}
            bordered={false}
            style={{
                width: 300,
            }}
        >
            <div>{t.description}</div>
            <div>{labelInput}</div>
            <div>{t.label}</div>
            <Flex><Button onClick={() => Editelement(t)}><FaEdit />
            </Button>
                <Button onClick={() => deleteNotes(t._id)} > <MdOutlineDelete /></Button>
                <Button onClick={() => { showModal(t) }}>
                    <MdLabelImportant />
                </Button>
            </Flex>
        </Card>
        </Flex></div>
    }) : <></>
    const AllNotes = () => {
        updateFilteredNotes([...notes])
    }
    const listOfFilter = (item) => {
        var filtered = notes.filter(e => e.label.includes(item));
        updateFilteredNotes(filtered)
    }
    const allLabel = labelArray.map((i) => { return <Button onClick={() => { listOfFilter(i) }}>{i}</Button> })

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };
    const items = [{ icon: <TagOutlined />, label: <Button onClick={() => { AllNotes() }}>all</Button> }, ...allLabel.map((label) => { return { icon: <TagOutlined />, label: label } })]
    return (
        <>
            <div className="example">
                <Button
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{
                        marginBottom: 16,
                    }}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                <Menu
                    mode="inline"
                    inlineCollapsed={collapsed}
                    items={items}
                />
            </div>
            <div className="itemlist">
                {visibility ? <input onFocus={() => { setVisibility(false); }} type="text" placeholder="Take a  Note"></input> : <div> <input className="itemlist" type="text" placeholder="Title" onfocusout={() => { setVisibility(true) }} onChange={(e) => { setTitle(e.target.value) }} value={inputTitle}></input>
                    <input type="text" placeholder="Take a Note" onfocusout={() => { setVisibility(true) }} onChange={(e) => { setDescription(e.target.value) }} value={inputDescription} onKeyDown={(e) => { if (e.key === "Enter") { addNotes() } }}></input>
                    <Flex gap="small" wrap> <Button type="primary" className="buttons" style={{ marginTop: 10 }} onClick={() => { addNotes() }}>{editObj?.id ? <CiEdit />
                        : <IoMdAdd />
                    }</Button></Flex>
                </div>
                }
            </div>
            {Array.isArray(filteredNotes) && filteredNotes?.length > 0 &&
                <div>{addingElement}</div>
            }
            <Modal destroyOnClose open={isModalOpen} onOk={() => {
                console.log("[labelInput] --> ", labelInput);
                addLabelValue(filteredNotes.find(i => i.id === editObj.id))
                // }
                // else {
                //     alert("Empty lable not allowed.")
                // }
            }} onCancel={handleCancel}>
                <p>Label note</p>
                <input type="text" placeholder="Enter Label" value={labelInput} onChange={(e) => { setLabelInput(e.target.value); }}></input>
                <Checkbox.Group options={labelArray} defaultValue={editObj?.label} onChange={saveLable} />

            </Modal>
        </>
    )
}

export default Homepage;
