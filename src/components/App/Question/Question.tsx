import './Question.scss';
import { IoIosArrowDown } from "react-icons/io";
import React, { useState, useRef, useEffect, MutableRefObject } from 'react';

interface QuestionProps {
  title: string;
  content: string[] | string;
}

const Question: React.FC<QuestionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      } else {
        contentRef.current.style.maxHeight = '0';
      }
    }
  }, [isOpen]);

  return (
    <div className="questions_list_item">
      <div className="questions_list_item_title" onClick={toggle}>
        <span className="questions_list_item_title_text">{title}</span>
        <div className={`questions_list_item_title_icon ${isOpen && 'questions_list_item_title_icon-open'}`}>
          <IoIosArrowDown size={25} />
        </div>
      </div>
      <div ref={contentRef} className={`questions_list_item_text ${isOpen ? 'open' : ''}`}>
        {typeof content === "string" ?
          <span className="questions_list_item_text_item">{content}</span> :
          content.map((text, idx) => (
            <span key={idx} className="questions_list_item_text_item">{text}</span>
          ))}
      </div>
    </div>
  );
};

export default Question;