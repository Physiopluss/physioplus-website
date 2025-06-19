import React, { useEffect, useState, useMemo } from "react";
import Joyride, { STATUS } from "react-joyride";
import { useNavigate } from "react-router-dom";

const LoginGuide = ({ openLoginMenu }) => {
  const navigate = useNavigate();

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [userType, setUserType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const isSmall = window.innerWidth < 768;
    setIsMobile(isSmall);

    const guideCompleted = localStorage.getItem("guideCompleted");

    if (!guideCompleted) {
      setShowModal(true);
    }
  }, []);

  const steps = useMemo(() => {
    if (!userType) return [];

    return isMobile
      ? [
        {
          target: ".btn-open-mobile-menu",
          content: "Tap here to open the menu",
          disableBeacon: true,
        },
        {
          target: ".btn-open-mobile-login",
          content: "Tap here to view login options",
        },
        {
          target: userType === "physio" ? ".btn-physio-login" : ".btn-patient-login",
          content: `Tap here to login as a ${userType}`,
        },
      ]
      : [
        {
          target: ".btn-open-login",
          content: "Click here to open login options",
          disableBeacon: true,
        },
        {
          target: userType === "physio" ? ".btn-physio-login" : ".btn-patient-login",
          content: `Click here to login as a ${userType}`,
        },
      ];
  }, [userType, isMobile]);

  const waitForElement = (selector, callback) => {
    const el = document.querySelector(selector);
    if (el) return callback();
    setTimeout(() => waitForElement(selector, callback), 200);
  };

  const handleJoyrideCallback = (data) => {
    const { index, type, action, status } = data;

    if (type === "step:after" && action === "next") {
      if (isMobile) {
        if (index === 0) {
          document.querySelector(".btn-open-mobile-menu")?.click();
          waitForElement(".btn-open-mobile-login", () => setStepIndex(1));
        } else if (index === 1) {
          document.querySelector(".btn-open-mobile-login")?.click();
          waitForElement(
            userType === "physio" ? ".btn-physio-login" : ".btn-patient-login",
            () => setStepIndex(2)
          );
        } else if (index === 2) {
          document.querySelector(userType === "physio" ? ".btn-physio-login" : ".btn-patient-login")?.click();
          localStorage.setItem("guideCompleted", "true");
          setRun(false);
          navigate(userType === "physio" ? "/login-physio" : "/login");
        }
      } else {
        if (index === 0) {
          openLoginMenu?.();
          waitForElement(userType === "physio" ? ".btn-physio-login" : ".btn-patient-login", () =>
            setStepIndex(1)
          );
        } else if (index === 1) {
          document.querySelector(userType === "physio" ? ".btn-physio-login" : ".btn-patient-login")?.click();
          localStorage.setItem("guideCompleted", "true");
          setRun(false);
          navigate(userType === "physio" ? "/login-physio" : "/login");
        }
      }
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setStepIndex(0);
      localStorage.setItem("guideCompleted", "true");
    }
  };

  const handleUserTypeSelect = (type) => {
    const guideCompleted = localStorage.getItem("guideCompleted");
    if (guideCompleted) return;

    setUserType(type);
    setShowModal(false);
    setRun(true);
    setStepIndex(0);
  };

  const handleSkipGuide = () => {
    setShowModal(false);
    setRun(false);
    setStepIndex(0);
    localStorage.setItem("guideCompleted", "true");
  };

  return (
    <>
      {/* 🧭 Joyride Tour */}
      {run && userType && (
        <Joyride
          steps={steps}
          run={run}
          stepIndex={stepIndex}
          callback={handleJoyrideCallback}
          continuous
          scrollToFirstStep
          showSkipButton
          showProgress
          disableOverlayClose
          styles={{
            options: {
              zIndex: 9999,
              primaryColor: "#10B981",
            },
          }}
        />
      )}

      {/* 🙋 User Type Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-80 text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Who are you?</h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-around">
                <button
                  onClick={() => handleUserTypeSelect("patient")}
                  className="bg-[#219f36] hover:bg-green text-white px-4 py-2 rounded"
                >
                  Patient
                </button>
                <button
                  onClick={() => handleUserTypeSelect("physio")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Physio
                </button>
              </div>
              <button
                onClick={handleSkipGuide}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginGuide;
