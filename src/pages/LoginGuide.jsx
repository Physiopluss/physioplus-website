import React, { useEffect, useState, useMemo } from "react";
import Joyride, { STATUS } from "react-joyride";
import { useNavigate } from "react-router-dom";

const LoginGuide = () => {
  const navigate = useNavigate();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const waitForElement = (selector, callback) => {
    const el = document.querySelector(selector);
    if (el) return callback();
    setTimeout(() => waitForElement(selector, callback), 200);
  };

  useEffect(() => {
    const isSmall = window.innerWidth < 768;
    setIsMobile(isSmall);

    const guideCompleted = localStorage.getItem("guideCompleted");
    if (!guideCompleted) {
      const selector = isSmall
        ? ".guide-mobile-menu-btn"
        : ".guide-desktop-login-btn";
      waitForElement(selector, () => setRun(true));
    }
  }, []);

  const steps = useMemo(() => {
    return isMobile
      ? [
          {
            target: ".guide-mobile-menu-btn",
            content: "Tap here to open the menu",
            disableBeacon: true,
          },
          {
            target: ".guide-mobile-login-btn",
            content: "Tap here to log in to your account",
          },
        ]
      : [
          {
            target: ".guide-desktop-login-btn",
            content: "Click here to log in to your account",
            disableBeacon: true,
          },
        ];
  }, [isMobile]);

  const handleJoyrideCallback = (data) => {
    const { index, type, action, status } = data;

    if (type === "step:after" && action === "next") {
      if (isMobile) {
        if (index === 0) {
          document.querySelector(".guide-mobile-menu-btn")?.click();
          waitForElement(".guide-mobile-login-btn", () => setStepIndex(1));
        } else if (index === 1) {
          document.querySelector(".guide-mobile-login-btn")?.click();
          localStorage.setItem("guideCompleted", "true");
          setRun(false);
          navigate("/login");
        }
      } else {
        if (index === 0) {
          document.querySelector(".guide-desktop-login-btn")?.click();
          localStorage.setItem("guideCompleted", "true");
          setRun(false);
          navigate("/login");
        }
      }
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setStepIndex(0);
      localStorage.setItem("guideCompleted", "true");
    }
  };

  return (
    <>
      {run && (
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
    </>
  );
};

export default LoginGuide;
