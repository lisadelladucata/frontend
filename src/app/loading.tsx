import FadeLoader from "react-spinners/FadeLoader";

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <FadeLoader color="#1073d6" />
    </div>
  );
};

export default Loading;
