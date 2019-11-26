import * as React from "react";
import { shallow } from "enzyme";
import ColumnPicker from "./index";

describe("ColumnPicker component", () => {
  it("Renders without crashing", () => {
    shallow(
      <ColumnPicker
        sourceSchema={{ owner: { table: ["column1", "column2"] } }}
      />
    );
  });
});
