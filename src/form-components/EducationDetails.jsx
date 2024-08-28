import { useState } from "react";
import DatePicker from 'react-datepicker';
import './FormStyle.css';
import 'react-datepicker/dist/react-datepicker.css';

const EducationDetailsForm = ({onFormChange, formData}) => {

    const [educationDetails, setEducationDetails] = useState(() => {
        if (formData.educationDetails) {
            const arr = [];
            for (let i = 0; i < formData.educationDetails.length; i++) {
                arr.push(i+1);
            }
            return arr;
        } else return [1];
    });

    const [ongoing, setOngoing] = useState(() => {
        if (formData.educationDetails) {
            const arr = [];
            for (let educationDetail of formData.educationDetails) {
                if (educationDetail.ongoing === "on") {
                    arr.push(true)
                } else {
                    arr.push(false);
                }    
            }
            return arr;
        } else return [false];
    });

    const handleAddSet = () => {
        setEducationDetails(prevArr => {
            const newArr = [...prevArr];
            newArr.push(prevArr[prevArr.length-1] + 1);
            return newArr;
        });
        setOngoing(prevArr => {
            const newArr = [...prevArr];
            console.log(newArr);
            newArr.push(false);
            return newArr;
        });
    }

    const handleRemoveSet = () => {
        let length = educationDetails.length;
        setEducationDetails(prevArr => {
            length = prevArr.length;
            const newArr = [...prevArr];
            if (newArr.length > 1) newArr.pop();
            return newArr;
        });
        length = length > 1? (length - 1) : length;
        console.log(length);
        const e = {target:{name:`educationDetails_${length}`}}
        // const e = {remove:"remove", section:`educationDetails_${length}`};
        onFormChange(e);
    }

    const handleDateChange = (value, name) => {
        onFormChange({target: {name, value}});
    }

    const handleCheckbox = (e) => {
        setOngoing(value => {
            if (value === true) e.target.value = "off";
            else e.target.value = "on";
            onFormChange(e);
            return !value
        });
    }

    return (
        <div>
        <form>
            {
                educationDetails.map((x) => (
                    <div key={x} className="form-section-details">
                        <div className="form-field">
                            <label>University Name</label>
                            <input 
                            type="text" 
                            name={`educationDetails_${x}_universityName`}
                            value={formData.educationDetails?.at(x-1)?.universityName || ''}
                            onChange={onFormChange}
                            />
                        </div>
                        <div className="form-field">
                            <label>Degree Name</label>
                            <input 
                            type="text" 
                            name={`educationDetails_${x}_degreeName`}
                            value={formData.educationDetails?.at(x-1)?.degreeName || ''}
                            onChange={onFormChange}
                            />
                        </div>
                        <div className="form-field">
                            <label>Location</label>
                            <input 
                            type="text" 
                            name={`educationDetails_${x}_location`}
                            value={formData.educationDetails?.at(x-1)?.location || ''}
                            onChange={onFormChange}
                            />
                        </div>
                        <div className="form-field">
                            <label>Start Date</label>
                            <DatePicker
                            className="datepicker"
                            selected={formData.educationDetails?.at(x-1)?.startDate || ''}
                            onChange={(date) => handleDateChange(date, `educationDetails_${x}_startDate`)}
                            dateFormat="MM/yyyy"
                            showMonthYearPicker
                            />
                            {/* <input 
                            type="date" 
                            name={`educationDetails_startDate_${x}`}
                            value={formData.educationDetails?.at(x-1)?.startDate || ''}
                            onChange={(date) => handleDateChange(date, `educationDetails_startDate_${x}`)}
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
                                    selected={formData.educationDetails?.at(x-1)?.endDate || ''}
                                    onChange={(date) => handleDateChange(date, `educationDetails_${x}_endDate`)}
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
                                {ongoing[x-1] ? (
                                    <input 
                                    type="checkbox"
                                    id="ongoing"
                                    name={`educationDetails_${x}_ongoing`}
                                    onChange={handleCheckbox}
                                    checked
                                    />
                                ) : (
                                    <input 
                                    type="checkbox"
                                    id="ongoing"
                                    name={`educationDetails_${x}_ongoing`}
                                    onChange={handleCheckbox}
                                    />
                                )
                                }
                                <label>Ongoing</label>
                            </div>
                        </div>
                    </div>
                    
                ))
            }
            
        </form>
        <div className="fieldset-button-container">
        <button onClick={handleAddSet} className="change-field">Add Fieldset</button>
        {(educationDetails.length > 1) &&
        <button onClick={handleRemoveSet} className="change-field">Remove Fieldset</button>
        }
        </div>
        </div>
    );
}

export default EducationDetailsForm;