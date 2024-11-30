import Img from "./Img";

// A function to check file type and return preview
export const getThumbnailfromFile = (file) => {
  if (file.type.startsWith("image/")) {
    // For images
    return URL.createObjectURL(file);
  } else if (file.type === "application/pdf") {
    // Placeholder for PDFs
    return "/path-to-your-pdf-icon.svg"; // Replace with your custom PDF icon
  } else {
    // Placeholder for other file types
    return "/path-to-your-default-file-icon.svg"; // Replace with a default file icon
  }
};

export const getThumbnailfromUrl = (url) => {
    if (url.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
      // Image file: return the URL itself
      return url;
    } else if (url.match(/\.pdf$/i)) {
      // PDF file: return a placeholder icon or preview generator
      return "/pdf.png"; // Replace with your PDF icon
    } else {
      // Other files: return a default icon
      return "/path-to-your-default-file-icon.svg"; // Replace with your default icon
    }
  };

export const Thumbnail = ({ url, showName = false }) => {
    const name = url.split("/").pop();
    return (
        <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-sm hover:shadow-lg" >
          <Img
              src={getThumbnailfromUrl(url)}
              alt={name}
              className="w-24 h-24 object-cover rounded-md"
          />

          {showName && 
          <p className="text-sm text-gray-700 mt-2 text-center truncate">
              {name}
          </p>
          }
          
        </div>
    );
};

export default Thumbnail;
