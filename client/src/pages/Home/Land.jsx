import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/";
export default function Land() {
  const navigate = useNavigate();

  return (
    <div>
      <CustomButton
        btnType="button"
        title="create a wera"
        styles="bg-[#8c6dfd]"
        handleClick={() => {navigate("/createJob");}}
      />
      Dashboard
    </div>
  );
}
