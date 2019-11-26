import { Tab, Tabs, TabId } from "@blueprintjs/core";
import * as React from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
import InputColumns from "./components/InputColumns";
import TabColumnSuggestion from "./components/TabColumnSuggestion";
import TabColumnPicking from "./components/TabColumnPicking";
import TabSQLParser from "./components/TabSQLParser";
import FhirMappingPanel from "./components/FhirMappingPanel";

// Import types
import { IReduxStore } from "../../types";

import "./style.less";

const MappingView = () => {
  const data = useSelector((state: IReduxStore) => state.data);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const [selectedTabId, setSelectedTabId] = React.useState("picker" as TabId);

  return (
    <div>
      <Navbar />
      <div id="mapping-explorer-container">
        <div id="main-container">
          <div id="exploration-panel">
            <InputColumns
              selectedAttribute={selectedNode.attribute}
              schema={
                selectedNode.source.name
                  ? data.sourceSchemas.schemaBySourceName[
                      selectedNode.source.name
                    ]
                  : {}
              }
              source={selectedNode.source}
            />
            <div id="column-selection">
              <Tabs
                onChange={(tabId: TabId) => {
                  setSelectedTabId(tabId);
                }}
                selectedTabId={selectedTabId}
              >
                <Tab
                  id="picker"
                  panel={
                    <TabColumnPicking
                      attribute={selectedNode.attribute}
                      schema={
                        selectedNode.source.name
                          ? data.sourceSchemas.schemaBySourceName[
                              selectedNode.source.name
                            ]
                          : {}
                      }
                      source={selectedNode.source}
                    />
                  }
                  title="Column Selection"
                />
                <Tab
                  id="sql-parser"
                  panel={<TabSQLParser />}
                  title="SQL Parser"
                />
                <Tab
                  id="mb"
                  disabled
                  panel={<TabColumnSuggestion />}
                  title="Column Suggestion"
                />
              </Tabs>
            </div>
          </div>
          <div id="fhir-panel">
            <FhirMappingPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingView;
