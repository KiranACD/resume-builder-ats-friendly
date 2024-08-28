import './ResumePreview.css';

const ResumePreview = ({pdfURL}) => {
    return (
        <div className="frame-container" >
            {
                pdfURL && <iframe className="frame" src={pdfURL}></iframe>
            }
        </div>
    );
}

export default ResumePreview;