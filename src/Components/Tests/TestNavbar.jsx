import React, { useEffect, useRef, useState } from "react";
import Logo_Temp from "../../assets/Logo-Temp.png";
import { evaluteTest } from "../../services/testService";
import { MdExitToApp } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const TestNavbar = ({
  heading,
  questionsRange,
  setQuestionsRange,
  questionsData,
  result,
  questionsPerPage,
  noOfSections,
  testQueryName,
  isInstruction,
}) => {
  const navigate = useNavigate();
  const range1 = Array.from({ length: noOfSections }).fill(false);
  range1[0] = true;

  const [secData, setSecData] = useState(range1);
  const [currSec, setCurrSec] = useState(0);

  useEffect(() => {
    setSecData(range1);
  }, [noOfSections]);

  useEffect(() => {
    setCurrSec(Math.ceil(questionsRange[0] / questionsPerPage));
  }, [questionsRange]);

  let itemRefs = useRef([]);

  useEffect(() => {
    itemRefs.current[currSec]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [currSec]);

  const goToSec = (sec) => {
    if (secData[sec] == true) {
      setQuestionsRange([
        questionsPerPage * sec,
        questionsPerPage * sec + questionsPerPage,
      ]);
    } else {
      alert("Answer all the previous sections");
    }
    // console.log(questionsRange);

    // itemRefs.current[sec]?.scrollIntoView({
    //   behavior: "smooth", // Optional: defines the transition animation
    //   block: "nearest", // Optional: defines vertical alignment
    //   inline: "start", // Optional: defines horizontal alignment
    // });
  };

  const goToPrev = () => {
    if (questionsRange[0] >= questionsPerPage) {
      setQuestionsRange([
        questionsRange[0] - questionsPerPage,
        questionsRange[0],
      ]);

      window.scrollTo(0, 0);
    }
  };

  const goToNext = () => {
    const tempSecData = secData;
    tempSecData[Math.ceil(questionsRange[1] / questionsPerPage)] = true;
    setSecData(tempSecData);

    if (questionsRange[1] + questionsPerPage <= questionsData.length) {
      setQuestionsRange([
        questionsRange[0] + questionsPerPage,
        questionsRange[1] + questionsPerPage,
      ]);
    } else if (questionsRange[0] + questionsPerPage < questionsData.length) {
      setQuestionsRange([
        questionsRange[0] + questionsPerPage,
        questionsData.length,
      ]);
    }

    window.scrollTo(0, 0);
  };

  const checkIfAllAnswered = () => {
    const answeredAllQuestions = questionsData
      .slice(questionsRange[0], questionsRange[1])
      .every((questionData) => questionData.id in result);

    if (!answeredAllQuestions)
      alert("Answer all the questions in this section.");

    return answeredAllQuestions;
  };

  const hadleSubmit = async () => {
    console.log("Submitted", result);
    const finRes = await evaluteTest(testQueryName, result);
    console.log(finRes);
    navigate("/result", {
      state: { result: finRes, testName: testQueryName },
    });
  };

  const goToTestList = () => {
    const confirmNavigation = window.confirm(
      "Are you sure? Your progress will be lost!"
    );
    if (confirmNavigation) {
      navigate("/testList");
    }
  };

  return (
    <>
      {secData && (
        <div className="h-[7em] fixed top-0 z-20 w-full">
          <div className="h-[50%] bg-white flex justify-between items-center">
            <div className="h-full flex items-center ml-1 w-[12em]">
              <img
                src={Logo_Temp}
                alt="Loading"
                className="object-contain h-[90%]"
              ></img>
              <p className="md:block hidden font-medium text-lg  ">
                BranchSelector
              </p>
            </div>
            <h1 className="font-bold text-xl flex justify-center items-center h-full w-full md:text-3xl">
              {heading}
            </h1>
            <div className="h-full flex items-center justify-end w-[12em]">
              <button
                onClick={() => goToTestList()}
                className="bg-[#E43131] rounded-md h-[55%]  font-semibold text-white mr-1 flex justify-evenly items-center p-2 text-md hover:bg-[#eb6565] "
              >
                <MdExitToApp /> <p className="hidden md:block">Exit</p>
              </button>
            </div>
          </div>

          <div className="h-[50%] bg-[#F3F3F3] border-y border-y-[#D6D6D6] border-y-solid flex items-center justify-center">
            {/* <h3 className="font-semibold cursor-pointer hover:text-[#686868]">
          Prev
        </h3>
        <h3 className="font-semibold cursor-pointer hover:text-[#686868]">
          Next
        </h3> */}

            {!isInstruction && (
              <div className="flex items-center justify-center w-full">
                {questionsRange[0] == 0 ? (
                  <button
                    className="font-bold cursor-pointer text-[#727272] ml-5"
                    onClick={() => goToPrev()}
                  >
                    {/* <IoIosArrowBack size={22} /> */}
                    Prev
                  </button>
                ) : (
                  <button
                    className="font-bold cursor-pointer  hover:text-[#686868] ml-5"
                    onClick={() => goToPrev()}
                  >
                    {/* <IoIosArrowBack size={22} /> */}
                    Prev
                  </button>
                )}

                <ul className=" flex justify-between mx-0 max-w-max overflow-x-auto md:mx-5 md:max-w-[40%] md:overflow-hidden">
                  {secData.map((val, index) => (
                    <li
                      onClick={() => {
                        goToSec(index);
                      }}
                      key={index}
                      ref={(el) => (itemRefs.current[index] = el)}
                      className={`mx-2 ${
                        val
                          ? "bg-[#367AF3] text-white"
                          : "bg-[#CBE1F6] text-black"
                      } 
                    ${
                      currSec == index &&
                      "border-2 border-[#191919] border-solid"
                    }
                    rounded-full  h-[2em] cursor-pointer font-bold text-sm flex justify-center items-center px-3`}
                    >
                      {index + 1}
                    </li>
                  ))}
                </ul>

                {questionsRange[1] >= questionsData.length ? (
                  <button
                    className="font-bold cursor-pointer text-[#367AF3] hover:text-[#7aa7f4] mr-5 text-"
                    onClick={() => hadleSubmit()}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="font-bold cursor-pointer hover:text-[#686868] mr-5"
                    onClick={() => {
                      checkIfAllAnswered() ? goToNext() : console.log();
                    }}
                  >
                    {/* <IoIosArrowForward size={22} /> */}
                    Next
                  </button>
                )}
              </div>
            )}

            {isInstruction && (
              <h1 className="font-bold text-xl flex justify-center items-center h-full w-full md:text-2xl">
                Instructions
              </h1>
            )}
          </div>
        </div>
      )}
    </>
  );
};
