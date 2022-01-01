import { BsShieldFillCheck, BiSearchAlt, RiHeart2Fill } from "react-icons/all";

const ServiceCard = ({ color, title, subtitle, icon }) => (
  <div className="flex flex-row justify-start w-[80%] mf:w-[95%] items-center white-glassmorphism p-3 m-3 cursor-pointer hover:shadow-xl">
    <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>{icon}</div>
    <div className="ml-5 flex flex-col flex-1">
      <h1 className="mt-2 text-white text-lg">{title}</h1>
      <p className="mt-2 text-white text-sm md:w-9/12">{subtitle}</p>
    </div>
  </div>
);

const Services = () => {
  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-center gradient-bg-services">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12">
        <div className="flex-1 flex flex-col  items-center justify-center">
          <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient w-10/12 md:w-[80%] mf:text-left text-center">
            Services that we continue to imporve
          </h1>
        </div>
        <div className="flex flex-1 flex-col justify-start items-center">
          <ServiceCard
            color="bg-[#2952e3]"
            title="Security Guaranteed"
            icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
            subtitle="Security Guaranteed. We always maintain privacy and maintain the quality of our product"
          />
          <ServiceCard
            color="bg-[#8945F8]"
            title="Best exchange rates"
            icon={<BiSearchAlt fontSize={21} className="text-white" />}
            subtitle="Security Guaranteed. We always maintain privacy and maintain the quality of our product"
          />
          <ServiceCard
            color="bg-[#F84550]"
            title="Fastest Transactions"
            icon={<RiHeart2Fill fontSize={21} className="text-white" />}
            subtitle="Security Guaranteed. We always maintain privacy and maintain the quality of our product"
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
