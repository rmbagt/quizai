import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

export default function Footer() {
  return (
    <div className="flex flex-col gap-4 border-t-2 px-4 py-5 text-xs md:gap-6 md:px-10 md:text-base">
      <Link href="#" className="font-bold md:text-[24px]">
        Logo
      </Link>
      <section className="flex flex-col gap-4 md:gap-6">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 font-semibold text-gray-600 dark:text-gray-500 md:flex-row md:gap-8">
            <Link href={"#"}>
              <h2>About Us</h2>
            </Link>
            <Link href={"#"}>
              <h2>Contact</h2>
            </Link>
            <Link href={"#"}>
              <h2>Project</h2>
            </Link>
            <Link href={"#"}>
              <h2>Partner</h2>
            </Link>
          </div>
          <div className="flex flex-col justify-start gap-2 md:justify-end">
            <h2 className="flex text-gray-600 dark:text-gray-300">Follow Us</h2>
            <div className="flex gap-2 md:gap-4">
              <FaLinkedin size={24} />
              <RiInstagramFill size={24} />
              <FaFacebook size={24} />
            </div>
          </div>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <div className="flex flex-col gap-1 md:flex-row md:gap-8">
            <Link href={"#"}>
              <h2>Privacy Policy</h2>
            </Link>
            <Link href={"#"}>
              <h2>Terms of Use</h2>
            </Link>
          </div>
          <div className="flex items-end">
            <h2>© 2024 RMBA</h2>
          </div>
        </div>
      </section>
    </div>
  );
}
