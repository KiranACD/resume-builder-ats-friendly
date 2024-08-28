import { useCallback, useEffect, useRef, useState } from 'react';
import PersonalDetailsForm from './form-components/PersonalDetails';
import EducationDetailsForm from './form-components/EducationDetails';
import ExperienceDetailsForm from './form-components/ExperienceDetails';
import ProjectDetailsForm from './form-components/ProjectDetails';
import SkillsDetailsForm from './form-components/SkillsDetails';
import './FormStepper.css';


const FormStepper = ({onFormChange, formData, savePDF}) => {

    const Forms = [
        {
            name: "Personal",
            Component: ({onFormChange, formData}) => <PersonalDetailsForm onFormChange={onFormChange} formData={formData} />,
        },
        {
            name: "Education",
            Component: () => <EducationDetailsForm onFormChange={onFormChange} formData={formData} />,
        },
        {
            name: "Experience",
            Component: () => <ExperienceDetailsForm onFormChange={onFormChange} formData={formData} />,
        },
        {
            name: "Projects",
            Component: () => <ProjectDetailsForm onFormChange={onFormChange} formData={formData} />,
        },
        {
            name: "Skills",
            Component: () => <SkillsDetailsForm onFormChange={onFormChange} formData={formData} />,
        }
    ]

    const [currentStep, setCurrentStep] = useState(1);
    const [isComplete, setIsComplete] = useState(false);
    const [margin, setMargin] = useState({
        marginLeft: 0,
        marginRight: 0
    });
    const stepRef = useRef([]);

    useEffect(() => {
        console.log(stepRef.current[0].offsetWidth / 2, stepRef.current[Forms.length - 1].offsetWidth / 2);
        setMargin({
            marginLeft: stepRef.current[0].offsetWidth / 2,
            marginRight: stepRef.current[Forms.length - 1].offsetWidth / 2,
        });
    }, [stepRef, Forms.length]);

    

    const ActiveComponent = Forms[currentStep-1]?.Component;
    const handleNext = () => {
        setCurrentStep(prevStep => {
            if (prevStep === Forms.length) {
                savePDF("save");
                setIsComplete(true);
                return prevStep;
            } else {
                return prevStep + 1;
            }
        })
    };

    const handlePrev = () => {
        setCurrentStep(prevStep => {
            if (prevStep === 1) {
                return prevStep;
            } else {
                return prevStep - 1;
            }
        })
    }

    const handleClick = (index) => {
        setCurrentStep(index);
    }
    return (
    <>
    <div className="stepper">
        {Forms.map((form, index) => {
            return (
                <div 
                    key={form.name}
                    ref={(el) => (stepRef.current[index] = el)} 
                    className={`step ${currentStep === index+1 ? "active":""}`}>
                    <div className="step-number"
                         onClick={() => handleClick(index+1)}>
                        {index+1}
                    </div>
                    <div className="step-name">{form.name}</div>
                </div>
            );
        })}
        <div className="progress-bar"
             style={{
                width: `calc(100% - ${margin.marginLeft + margin.marginRight}px)`,
                marginLeft: margin.marginLeft,
                marginRight: margin.marginRight,
             }}
        >
            <div className="progress"></div>
        </div>
    </div>
    {ActiveComponent({onFormChange, formData})} 
    <div className="btn-container">
        {currentStep !== 1 && (
        <button className="btn" onClick={handlePrev}>
            Previous
        </button>
        )
        }
        <button className="btn" onClick={handleNext}>
            {currentStep === Forms.length ? "Download" : "Next"}
        </button>
    </div>
    </>
    ); 
};

export default FormStepper;