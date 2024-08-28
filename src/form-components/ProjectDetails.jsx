import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './FormStyle.css';

const ProjectDetailsForm = ({onFormChange, formData}) => {

    const [projectDetails, setProjectDetails] = useState(() => {
        if (formData.projectDetails) {
            const arr = [];
            for (let i = 0; i < formData.projectDetails.length; i++) {
                arr.push(i+1);
            }
            console.log(arr);
            return arr;
        } else return [1];
    });
    const [descriptions, setDescriptions] = useState(() => {
        if (formData.projectDetails) {
            const outer = [];
            for (let projectDetail of formData.projectDetails) {
                console.log(projectDetail)
                if (projectDetail.description) {
                    const inner = [];
                    for (let i = 0; i < projectDetail.description.length; i++) {
                        inner.push(i+1);
                    }
                    outer.push(inner);
                } else outer.push([1]);
            }
            console.log(outer);
            return outer;
        } else return [[1]];
    });
    const [ongoing, setOngoing] = useState(() => {
        if (formData.projectDetails) {
            const arr = [];
            for (let projectDetail of formData.projectDetails) {
                if (projectDetail.ongoing === "on") {
                    arr.push(true)
                } else {
                    arr.push(false);
                }    
            }
            return arr;
        } else return [false];
    });

    const handleAddSet = () => {
        setProjectDetails(prevArr => {
            const newArr = [...prevArr];
            newArr.push(prevArr.length + 1);
            return newArr;
        });
        setDescriptions(prevArr => {
            const newArr = prevArr.map(innerArr => [...innerArr]);
            newArr.push([1]);
            return newArr;
        });
        setOngoing(prevArr => {
            const newArr = [...prevArr];
            newArr.push(false);
            return newArr;
        });
    }

    const handleRemoveSet = () => {
        let length = projectDetails.length;
        setProjectDetails(prevArr => {
            length = prevArr.length;
            const newArr = [...prevArr];
            if (newArr.length > 1) newArr.pop();
            return newArr;
        });
        setDescriptions(prevArr => {
            const newArr = prevArr.map(innerArr => [...innerArr]);
            newArr.pop();
            return newArr;
        });
        setOngoing(prevArr => {
            length = prevArr.length;
            const newArr = [...prevArr];
            if (newArr.length > 1) newArr.pop();
            return newArr;
        });
        length = length > 1? (length - 1) : length;
        console.log(length);
        const e = {target:{name:`projectDetails_${length}`}};
        // const e = {remove:"remove", section:`projectDetails_${length}`};
        onFormChange(e);
    }

    const handleCheckbox = (e, index) => {
        setOngoing(value => {
            const newValue = [...value];
            if (value[index] === true) e.target.value = "off";
            else e.target.value = "on";
            onFormChange(e);
            newValue[index] = !value[index];
            return newValue;
        });
    }

    const handleDateChange = (value, name) => {
        onFormChange({target: {name, value}});
    }

    const handleAddDescription = (e, x) => {
        e.preventDefault();
        setDescriptions(prevArr => {
            const newArr = prevArr.map(innerArr => [...innerArr]);
            const l = prevArr[x-1].length;
            newArr[x-1].push(l+1);
            return newArr;
        });
    }

    const handleRemoveDescription = (event, x) => {
        event.preventDefault();
        let length = descriptions[x-1].length;
        setDescriptions(prevArr => {
            length = prevArr[x-1].length;
            const newArr = prevArr.map(innerArr => [...innerArr]);
            if (newArr[x-1].length > 1) newArr[x-1].pop();
            return newArr;
        });
        length = (length > 1) ? (length - 1) : length;
        const e = {target:{name:`projectDetails_${x}_description_${length}`}}
        // const e = {remove:"remove", section: `projectDetails_${x}_description_${length}`};
        onFormChange(e);
    }

    
    return (
        <div>
            <form>
                {
                    projectDetails.map(x => (
                        <div key={x} className="form-section-details">
                            <div className="form-field">
                                <label>Project Title</label>
                                <input 
                                type="text"
                                name={`projectDetails_${x}_title`}
                                value={formData.projectDetails?.at(x-1)?.title || ''}
                                onChange={onFormChange} 
                                />
                            </div>
                            <div className="form-field">
                                <label>Tech Stack</label>
                                <input 
                                type="text" 
                                name={`projectDetails_${x}_techStack`} 
                                value={formData.projectDetails?.at(x-1)?.techStack || ''}
                                onChange={onFormChange} 
                                />
                            </div>
                            <div className="form-field">
                                <label>Link To Project</label>
                                <input 
                                type="text" 
                                name={`projectDetails_${x}_link`} 
                                value={formData.projectDetails?.at(x-1)?.link || ''}
                                onChange={onFormChange} 
                                />
                            </div>
                            <div className="form-field">
                                <label>Start Date</label>
                                <DatePicker
                                className="datepicker"
                                selected={formData.projectDetails?.at(x-1)?.startDate || ''}
                                onChange={(date) => handleDateChange(date, `projectDetails_${x}_startDate`)}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                />
                                {/* <input 
                                type="date" 
                                name={`experienceDetails_startDate_${x}`}
                                value={formData.experienceDetails?.at(x-1)?.startDate || ''}
                                onChange={onFormChange}
                                /> */}
                            </div>
                            <div className="endDate-container form-field">
                                {ongoing[x-1] ? (
                                    <div>
                                        <label>End Date</label>
                                        <DatePicker 
                                        disabled
                                        placeholderText="Disabled"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label>End Date</label>
                                        <DatePicker
                                        className="datepicker"
                                        selected={formData.projectDetails?.at(x-1)?.endDate || ''}
                                        onChange={(date) => handleDateChange(date, `projectDetails_${x}_endDate`)}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        />
                                        {/* <input 
                                        type="date" 
                                        name={`experienceDetails_endDate_${x}`}
                                        value={formData.experienceDetails?.at(x-1)?.endDate || ''}
                                        onChange={onFormChange}
                                        /> */}
                                    </div>
                                )}
                                
                                <div className="checkbox-field">
                                    <input 
                                    type="checkbox"
                                    id="ongoing"
                                    name={`projectDetails_${x}_ongoing`}
                                    onChange={(e) => handleCheckbox(e, x-1)}
                                    />
                                    <label>Ongoing</label>
                                </div>
                            </div>
                            <div className="description-container">
                            {
                                descriptions[x-1].map(y => (
                                    <div key={y} className="form-field">
                                        <label>Description</label>
                                        <input
                                        type="text" 
                                        name={`projectDetails_${x}_description_${y}`}
                                        value={formData.projectDetails?.at(x-1)?.description?.at(y-1) || ''}
                                        onChange={onFormChange} 
                                        />
                                    </div>
                                ))
                            }
                            <div className="fieldset-button-container">
                            <button className="description-button" onClick={(e) => handleAddDescription(e, x)}>Add Description Field</button>
                            {(descriptions[x-1].length > 1) &&
                            <button className="description-button" onClick={(e) => handleRemoveDescription(e, x)}>Remove Description Field</button>
                            }
                            </div>
                            </div>
                        </div>
                    ))
                }
            </form>
            <div className="fieldset-button-container">
            <button onClick={handleAddSet} className="change-field">Add Fieldset</button>
            {(projectDetails.length > 1) &&
            <button onClick={handleRemoveSet} className="change-field">Remove Fieldset</button>
            }
            </div>
        </div>
    )
}

export default ProjectDetailsForm;