import { useEffect, useState } from 'react'
import FormStepper from './FormStepper';
import ResumePreview from './ResumePreview'
import SimpleModal from './SimpleModal';
import './App.css'
import jsPDF from 'jspdf';

const nameFontSize = 25;
const titleFontSize = 10;
const firstLetterSize = 15;
const contactInfoSize = 9;

const normalFontSize = 10;
const lineGap = 4.5;
const itemGap = 5;
const underlineGap = 1;
const sectionGap = 10;

const startY = 15;

let currentY;

const defaultX = 10;
const titleStartX = 13;
const descriptionX = 16;

function App() {
  
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem('formData');
    return savedFormData ? JSON.parse(savedFormData) : {};
  });
  const [pdfURL, setPdfURL] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const getPosXForCenter = (doc, name) => {
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const textWidth = doc.getTextWidth(name);
    return (pageWidth-textWidth)/2;
  }

  const setName = (doc, name) => {
    doc.setFontSize(nameFontSize);
    doc.setFont('helvetica', 'bold');
    const posX = getPosXForCenter(doc, name);
    doc.text(name, posX, currentY);
  }

  const setContactInfo = (doc) => {
    doc.setFontSize(normalFontSize);
    doc.setFont('helvetica', 'normal');
    const contactInfo = [];
    if (formData['phone']) contactInfo.push(formData['phone']);
    if (formData['email']) contactInfo.push(formData['email']);
    if (formData['github']) contactInfo.push("github");
    if (formData['linkedin']) contactInfo.push("linkedin");
    const combined_contactInfo = contactInfo.join(" | ");
    let posX = getPosXForCenter(doc, combined_contactInfo);
    let initial_posX = posX;
    // const 
    if (formData['phone']) {
      doc.text(formData['phone'], posX, currentY);
      posX += doc.getTextWidth(formData['phone']);
    }
    if (formData['email']) {
      if (posX > initial_posX) {
        doc.text(" | ", posX, currentY);
        posX += doc.getTextWidth(" | ");
      }
      doc.text(formData['email'], posX, currentY);
      posX += doc.getTextWidth(formData['email']);
    }
    if (formData['github']) {
      if (posX > initial_posX) {
        doc.text(" | ", posX, currentY);
        posX += doc.getTextWidth(" | ");
      }
      doc.textWithLink("github", posX, currentY, {url:formData['github']});
      posX += doc.getTextWidth("github");
    }
    if (formData['linkedin']) {
      if (posX > initial_posX) {
        doc.text(" | ", posX, currentY);
        posX += doc.getTextWidth(" | ");
      }
      doc.textWithLink("linkedin", posX, currentY, {url:formData['linkedin']});
    }
    currentY += itemGap;
  }

  const setSectionTitle = (doc, title) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(firstLetterSize);
    doc.text(title[0], defaultX, currentY);
    const currentX = defaultX + doc.getTextWidth(title[0]);
    doc.setFontSize(titleFontSize);
    doc.text(title.substring(1), currentX, currentY);
  }

  const drawLine = (doc) => {
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const lineSize = pageWidth - (2*defaultX);
    const endLineX = defaultX + lineSize;
    doc.line(defaultX, currentY, endLineX, currentY);
    currentY += 1 + itemGap;
  }

  const setSectionItemTitle = (doc, title) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(titleFontSize);
    doc.text(title, titleStartX, currentY);
  }

  const setSectionItemTitleDesc = (doc, desc) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(titleFontSize);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const textLength = doc.getTextWidth(desc);
    const currentX = pageWidth - (titleStartX) - (textLength);
    doc.text(desc, currentX, currentY); 
  }

  const setSectionItemSubtitle = (doc, subtitle) => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(contactInfoSize);
    doc.text(subtitle, titleStartX, currentY);
  }

  const setSectionItemSubtitleDesc = (doc, desc, url) => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(contactInfoSize);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const textLength = doc.getTextWidth(desc);
    const currentX = pageWidth - (titleStartX) - (textLength);
    if (url) {
      doc.textWithLink(desc, currentX, currentY, {url:url});
    }
    else doc.text(desc, currentX, currentY);
  }

  const setSectionDescriptions = (doc, desc) => {
    const bullet = "•  ";
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(contactInfoSize);
    const bulletLength = doc.getTextWidth(bullet);
    const startX = descriptionX + bulletLength;
    doc.text(bullet, descriptionX, currentY);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const widthToSplit = pageWidth - (startX + titleStartX);
    const splitText = doc.splitTextToSize(desc, widthToSplit);
    splitText.forEach((line) => {
      doc.text(line, startX, currentY);
      currentY += lineGap;
    })
  }

  const setSectionSkill = (doc, skillType, skillValue) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(titleFontSize);
    doc.text(skillType + ":  ", titleStartX, currentY);
    const textLength = doc.getTextWidth(skillType + ":  ");
    const valueStart = titleStartX + textLength;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(titleFontSize);
    doc.text(skillValue, valueStart, currentY);
    currentY += lineGap;
  }

  const handleGeneratePdf = (action) => {
    const doc = new jsPDF();
    currentY = startY;
    if (formData.fullName) setName(doc, formData.fullName);
    if (formData.contactInfo) {
      currentY += lineGap;
      setContactInfo(doc);
    }

    currentY += itemGap;
    setSectionTitle(doc, "EDUCATION");
    currentY += underlineGap;
    drawLine(doc);
    doc.setFont('helvetica', 'normal');
    if (formData.educationDetails) {
      for (let educationDetail of formData.educationDetails) {
        let prevCurrentY = currentY;
        if (educationDetail.universityName) {
          setSectionItemTitle(doc, educationDetail.universityName);
        }
        if (educationDetail.location) {
          setSectionItemTitleDesc(doc, educationDetail.location);
        }
        currentY += lineGap;
        if (educationDetail.degreeName) {
          setSectionItemSubtitle(doc, educationDetail.degreeName);
        }
        if (educationDetail.period) {
          setSectionItemSubtitleDesc(doc, educationDetail.period);
        }
        currentY += itemGap;
      }
    }
    currentY += itemGap;
    setSectionTitle(doc, "WORK EXPERIENCE");
    currentY += underlineGap;
    drawLine(doc);
    doc.setFont('helvetica', 'normal');
    if (formData.experienceDetails) {
      for (let experienceDetail of formData.experienceDetails) {
        let prevCurrentY = currentY;
        if (experienceDetail.role) {
          setSectionItemTitle(doc, experienceDetail.role);
        }
        if (experienceDetail.period) {
          setSectionItemTitleDesc(doc, experienceDetail.period);
        }
        currentY += lineGap;
        if (experienceDetail.organization) {
          setSectionItemSubtitle(doc, experienceDetail.organization);
        }
        if (experienceDetail.location) {
          setSectionItemSubtitleDesc(doc, experienceDetail.location);
        }
        currentY += lineGap + 1;
        if (experienceDetail.description) {
          for (let description of experienceDetail.description) {
            setSectionDescriptions(doc, description);
          }
        }
        currentY += itemGap;
      }
    }
    currentY += itemGap;
    setSectionTitle(doc, "PROJECTS");
    currentY += underlineGap;
    drawLine(doc);
    doc.setFont('helvetica', 'normal');
    if (formData.projectDetails) {
      for (let projectDetail of formData.projectDetails) {
        let prevCurrentY = currentY;
        if (projectDetail.title) {
          setSectionItemTitle(doc, projectDetail.title);
        }
        if (projectDetail.period) {
          setSectionItemTitleDesc(doc, projectDetail.period);
        } 
        currentY += lineGap;
        if (projectDetail.techStack) {
          setSectionItemSubtitle(doc, projectDetail.techStack);
        }
        if (projectDetail.link) {
          setSectionItemSubtitleDesc(doc, "LINK", projectDetail.link); 
        }
        currentY += lineGap + 1; 
        if (projectDetail.description) {
          for (let description of projectDetail.description) {
            setSectionDescriptions(doc, description);
          }
        }
        currentY += itemGap;
      }
    }
    currentY += itemGap;
    setSectionTitle(doc, "SKILLS");
    currentY += underlineGap;
    drawLine(doc);
    doc.setFont('helvetica', 'normal');
    if (formData.skillDetails) {
      for (let skillDetail of formData.skillDetails) {
        if (skillDetail.type || skillDetail.value) {
          setSectionSkill(doc, skillDetail.type, skillDetail.value);
        }
      }
    }
    // if (formData.email) doc.text(formData.email, 10, 25);
    // if (formData.phone) doc.text(formData.phone, 10, 35);
    // if (formData.github) doc.text(formData.github, 10, 45);
    // if (formData.linkedin) doc.text(formData.linkedin, 10, 55);
    if (action === "preview") {
      const pdfBlob = doc.output('blob');
      if (pdfURL) {
        URL.revokeObjectURL(pdfURL);
      }
      const url = URL.createObjectURL(pdfBlob);
      setPdfURL(url);
      setIsModalOpen(true);
    } else if (action === "save") {
      const filename = prompt("Enter name for resume:", "resume");
      if (filename) {
        doc.save(`${filename}.pdf`);
      } else {
        doc.save("resume.pdf");
      }
      
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    URL.revokeObjectURL(pdfURL);
  };

  const handleFormChange = (e) => {
    const {name, value} = e.target;
    const formSection = name.split("_")[0];
    if (formSection === "personalDetails") updatePersonalDetails(name, value);
    if (formSection === "educationDetails") updateEducationDetails(name, value);
    if (formSection === "experienceDetails") updateExperienceDetails(name, value);
    if (formSection === "projectDetails") updateProjectDetails(name, value);
    if (formSection === "skillDetails") updateSkillDetails(name, value);
  }

  const handleRemoveField = (nameComponents) => {
    if (nameComponents.length === 4) {
      const [formSection, index, field, length] = nameComponents;
      setFormData(prevState => {
        const newState = {
          ...prevState
        };
        if (newState[formSection] && newState[formSection][index-1] && newState[formSection][index-1][field]) {
          newState[formSection][index-1][field] = newState[formSection][index-1][field].slice(0, length);
        }
        return newState;
      });
      return;
    }
    const [formSection, length] = nameComponents;
    setFormData(prevState => {
      const newState = {
        ...prevState
      };
      if (newState[formSection]) newState[formSection] = newState[formSection].slice(0, length);
      return newState;
    });
    return;
  }

  const handleAddField = (nameComponents, value) => {
    if (nameComponents.length === 4) {
      const [formSection, index, field, indexDesc] = nameComponents;
      setFormData(prevState => {
        const newState = {
          ...prevState
        };
        if (!(formSection in formData)) {
          newState[formSection] = [];
        }
        if (newState[formSection].length < index) {
          newState[formSection][index-1] = {};
        }
        if (!(field in newState[formSection][index-1])) {
          newState[formSection][index-1][field] = [];
        }
        newState[formSection][index-1][field][indexDesc-1] = value;
        return newState;
      });
      return;
    }
    const [formSection, index, field] = nameComponents;
    setFormData(prevState => {
      const newState = {
        ...prevState
      };
      if (!(formSection in formData)) {
        newState[formSection] = [];
      }
      if (newState[formSection].length < index) {
        newState[formSection][index-1] = {};
      }
      console.log(index-1, field, value, typeof value);

      newState[formSection][index-1][field] = value;
      // if (field === "endDate") {
      //   newState[formSection]
      // }
      // const dates = []
      // if (newState[formSection][index-1]['startDate']) dates[0] = formatDate(newState[formSection][index-1]['startDate']);
      // if (newState[formSection][index-1]['endDate']) {
      //   dates[1] = formatDate(newState[formSection][index-1]['endDate']);
      // }
      // if (newState[formSection][index-1]['startDate'] || newState[formSection][index-1]['endDate']) newState[formSection][index-1]['period'] = dates.join(" - ");
      return newState;
    })
  }

  const handleDateFields = (nameComponents) => {
    const [formSection, index, field] = nameComponents;
    setFormData(prevState => {
      const newState = {
        ...prevState
      };
      const dates = []
      if (newState[formSection][index-1]['startDate']) dates[0] = formatDate(newState[formSection][index-1]['startDate']);
      if (newState[formSection][index-1]['ongoing']) {
        if (newState[formSection][index-1]['ongoing'] === "off" && newState[formSection][index-1]['endDate']) {
          dates[1] = formatDate(newState[formSection][index-1]['endDate']);
        } else if (newState[formSection][index-1]['ongoing'] === "on") {
          dates[1] = "present";
        }
      } else {
        if (newState[formSection][index-1]['endDate']) {
          dates[1] = formatDate(newState[formSection][index-1]['endDate']);
        }
      }
      if (dates.at(0) || dates.at(1)) newState[formSection][index-1]['period'] = dates.join(" - ");
      console.log(newState[formSection][index-1]);
      return newState;
    });
  }

  function formatDate(date) {
    console.log(date);
    console.log(typeof date);
    const options = { year:'numeric', month: 'short' };
    const dateDate = new Date(date);
    return dateDate.toLocaleDateString('en-US', options);
  }

  const updateSkillDetails = (name, value) => {
    const nameComponents = name.split("_");
    if (value == undefined) {
      handleRemoveField(nameComponents);
    }
    handleAddField(nameComponents, value);
  }

  const updateProjectDetails = (name, value) => {
    const nameComponents = name.split("_");
    if (value == undefined) {
      handleRemoveField(nameComponents);
    }
    handleAddField(nameComponents, value);
    handleDateFields(nameComponents);
  }

  const updateExperienceDetails = (name, value) => {
    const nameComponents = name.split("_");
    if (value == undefined) {
      handleRemoveField(nameComponents);
    }
    handleAddField(nameComponents, value);
    handleDateFields(nameComponents);
  }

  const updateEducationDetails = (name, value) => {
    const nameComponents = name.split("_");
    console.log(nameComponents);
    if (value == undefined) {
      handleRemoveField(nameComponents);
    }
    handleAddField(nameComponents, value);
    handleDateFields(nameComponents);
  }

  const updatePersonalDetails = (name, value) => {
    const [formSection, formName] = name.split("_");
    setFormData(prevState => {
      const newState = {
      ...prevState,
      [formName]: value
      }
      return newState;
    }
    );
  }

  return (
    <div className="main-container">
      <div className="form-container">
        <FormStepper onFormChange={handleFormChange} formData={formData} savePDF={handleGeneratePdf}/>
      </div>
      <button className="modal-button" onClick={() => handleGeneratePdf("preview")}>Preview PDF</button>
      <SimpleModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <iframe className="frame" src={pdfURL}></iframe>
      </SimpleModal>
      {/* <div className="preview-container">
        <ResumePreview pdfURL={pdfURL} />
      </div> */}
    </div>
  )
}

export default App;
