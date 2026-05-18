import React from "react";
import { Composition } from "remotion";
import { MigrationForm } from "./compositions/MigrationForm";

export const Root: React.FC = () => {
  return (
    <Composition
      id="MigrationForm"
      component={MigrationForm}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{}}
    />
  );
};
