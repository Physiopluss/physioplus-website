// InfoSection.js


const InfoSection = ({ title, description, iconSrc, iconAlt }) => {
    return (
        <div className="my-6">
            <div className="flex items-center justify-between  my-3">
                <h3 className="text-xl font-semibold text-[#015C3E]">{title}</h3>
                <img src={iconSrc} alt={iconAlt} className="w-6 h-6" />
            </div>
            <div className="relative  flex items-center w-full h-[2px]  scale-y-[0.5] my-3">
                <div className="absolute left-0 top-0 h-[2px] scale-y-[1] bg-[#013C2E]" style={{ width: 'fit-content' }}>
                    <div className="text-xl font-semibold text-transparent select-none whitespace-nowrap">
                        {title}
                    </div>
                </div>
                <div className="bg-gray-300 w-full h-full"></div>
            </div>
            <p className="text-sm text-gray-700 text-pretty mb-9">{description}</p>
        </div>
    );
};

export default InfoSection;
