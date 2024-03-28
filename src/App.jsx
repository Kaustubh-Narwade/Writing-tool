import React, { useState } from "react";
import { Button, Modal, Input, Upload, message, Tooltip } from "antd";
import {
  PlusOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import "antd/dist/reset.css";
import "./App.css";

const { TextArea } = Input;

function App() {
  const [blocks, setBlocks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [blockType, setBlockType] = useState("text");
  const [blockContent, setBlockContent] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // Text editing states
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const handleAddBlock = () => {
    setModalVisible(true);
  };

  const handleModalOk = () => {
    if (blockContent.trim() !== "") {
      if (editIndex !== null) {
        const updatedBlocks = [...blocks];
        updatedBlocks[editIndex] = {
          type: blockType,
          content: editedContent || blockContent,
        };
        setBlocks(updatedBlocks);
        setEditedContent("");
        setEditIndex(null);
      } else {
        setBlocks([...blocks, { type: blockType, content: blockContent }]);
      }
      setBlockContent("");
      resetTextFormatting();
      setModalVisible(false);
    } else {
      message.error("Please enter content for the block");
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditIndex(null);
    setBlockContent("");
    setEditedContent("");
  };

  const handleTextChange = (e) => {
    setBlockContent(e.target.value);
  };

  const handleUpload = (info) => {
    if (info.file.status === "done") {
      setBlocks([
        ...blocks,
        { type: "image", content: info.file.originFileObj },
      ]);
      setModalVisible(false);
    } else if (info.file.status === "error") {
      message.error("Image upload failed");
    }
  };

  const toggleBold = () => {
    setBold(!bold);
  };

  const toggleItalic = () => {
    setItalic(!italic);
  };

  const toggleUnderline = () => {
    setUnderline(!underline);
  };

  const resetTextFormatting = () => {
    setBold(false);
    setItalic(false);
    setUnderline(false);
  };

  const handleBlockMouseEnter = (index) => {
    setEditIndex(index);
  };

  const handleBlockMouseLeave = () => {
    setEditIndex(null);
  };

  const handleEditBlock = (index) => {
    setEditIndex(index);
    setBlockType(blocks[index].type);
    setBlockContent(blocks[index].content);
    setModalVisible(true);
  };

  const handleDeleteBlock = (index) => {
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index, 1);
    setBlocks(updatedBlocks);
  };

  return (
    <div className="container">
      <div className="nav">
        <header className="App-header">
          <h1>Web-Based Writing Tool</h1>
          <div className="editor-tools">
            <Tooltip title="Bold">
              <Button
                onClick={toggleBold}
                icon={<BoldOutlined />}
                type={bold ? "primary" : ""}
              />
            </Tooltip>
            <Tooltip title="Italic">
              <Button
                onClick={toggleItalic}
                icon={<ItalicOutlined />}
                type={italic ? "primary" : ""}
              />
            </Tooltip>
            <Tooltip title="Underline">
              <Button
                onClick={toggleUnderline}
                icon={<UnderlineOutlined />}
                type={underline ? "primary" : ""}
              />
            </Tooltip>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddBlock}
          >
            Add Block
          </Button>
        </header>
      </div>
      <div className="main-content">
        <div className="blocks-container">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="block"
              onMouseEnter={() => handleBlockMouseEnter(index)}
              onMouseLeave={handleBlockMouseLeave}
            >
              <div className="block-edit-options">
                {editIndex === index && (
                  <>
                    <Tooltip title="Edit">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditBlock(index)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteBlock(index)}
                      />
                    </Tooltip>
                  </>
                )}
              </div>
              {block.type === "text" ? (
                <TextArea
                  rows={8}
                  cols={48}
                  value={block.content}
                  onChange={(e) => {
                    // text blocks are not editable, this is just for display
                  }}
                  style={{
                    fontWeight: bold ? "bold" : "normal",
                    fontStyle: italic ? "italic" : "normal",
                    textDecoration: underline ? "underline" : "none",
                  }}
                />
              ) : (
                <div className="image">
                  <img
                    src={URL.createObjectURL(block.content)}
                    alt="uploaded"
                    className="image-block"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <Modal
          title={editIndex !== null ? "Edit Block" : "Add Block"}
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText={editIndex !== null ? "Save" : "Add"}
        >
          <div className="select-block">
            <Button
              type={blockType === "text" ? "primary" : ""}
              onClick={() => setBlockType("text")}
            >
              Text Block
            </Button>
            <Button
              type={blockType === "image" ? "primary" : ""}
              onClick={() => setBlockType("image")}
            >
              Image Block
            </Button>
          </div>
          {blockType === "text" ? (
            <TextArea
              rows={4}
              value={blockContent}
              onChange={handleTextChange}
            />
          ) : (
            <Upload
            className="img-upload-btn"
              accept="image/*"
              showUploadList={false}
              customRequest={({ onSuccess, onError, file }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
              }}
              onChange={handleUpload}
            >
              <Button>Upload Image</Button>
            </Upload>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
