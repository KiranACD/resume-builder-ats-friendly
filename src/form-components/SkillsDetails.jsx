import { useState } from "react";

const SkillsDetailsForm = ({onFormChange, formData}) => {

    const [skillDetails, setSkillDetails] = useState(() => {
        if (formData.skillDetails) {
            const arr = [];
            for (let i = 0; i < formData.skillDetails.length; i++) {
                arr.push(i+1);
            }
            return arr;
        } else return [1];
    });

    const handleAddSet = () => {
        setSkillDetails(prevArr => {
            const newArr = [...prevArr];
            newArr.push(prevArr[prevArr.length-1] + 1);
            return newArr;
        });
    }

    const handleRemoveSet = () => {
        let length = skillDetails.length;
        setSkillDetails(prevArr => {
            length = prevArr.length;
            const newArr = [...prevArr];
            if (newArr.length > 1) newArr.pop();
            return newArr;
        });
        length = length > 1? (length - 1) : length;
        console.log(length);
        const e = {target:{name:`skillDetails_${length}`}}
        // const e = {remove:"remove", section:`skillDetails_${length}`};
        onFormChange(e);
    }

    return (
        <div>
            <form>
                {
                    skillDetails.map(x => (
                        <div key={x} className="form-section-details">
                            <div className="form-field">
                                <label>Skill Type</label>
                                <input 
                                type="text"
                                name={`skillDetails_${x}_type`}
                                value={formData.skillDetails?.at(x-1)?.type || ''}
                                onChange={onFormChange} 
                                />
                            </div>
                            <div className="form-field">
                                <label>Skill Value</label>
                                <input 
                                type="text"
                                name={`skillDetails_${x}_value`}
                                value={formData.skillDetails?.at(x-1)?.value || ''}
                                onChange={onFormChange} 
                                />
                            </div>
                        </div>
                    ))
                }
            </form>
            <div className="fieldset-button-container">
            <button onClick={handleAddSet} className="change-field">Add Fieldset</button>
            {(skillDetails.length > 1) &&
            <button onClick={handleRemoveSet} className="change-field">Remove Fieldset</button>
            }
            </div>
        </div>
    );
}

export default SkillsDetailsForm;