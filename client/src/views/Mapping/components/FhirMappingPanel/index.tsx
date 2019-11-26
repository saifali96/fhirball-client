import { Spinner } from "@blueprintjs/core";
import React from "react";
import { Query } from "react-apollo";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

// ACTIONS
import { updateFhirAttribute } from "src/services/selectedNode/actions";

// COMPONENTS
import AddResource from "./components/AddResource";
import FhirResourceTree from "./components/FhirResourceTree";
import ResourceSelector from "./components/ResourceSelector";

import { IReduxStore } from "src/types";

import { updateLocationParams } from "src/services/urlState";

// GRAPHQL
const availableResources = require("src/graphql/queries/availableResources.graphql");
const resourceAttributeTree = require("src/graphql/queries/resourceAttributeTree.graphql");

const FhirMappingPanel = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const { history, location } = useReactRouter();

  const [
    expandedAttributesIdList,
    setExpandedAttributesIdList
  ] = React.useState([]);
  const [createdResources, setCreatedResources] = React.useState(0);
  const [createdProfiles, setCreatedProfiles] = React.useState(0);

  return (
    <Query
      fetchPolicy={"network-only"}
      query={availableResources}
      skip={!selectedNode.source.id}
      variables={{
        sourceId: selectedNode.source.id,
        // This allows to force refetch
        // when a new resource is added.
        createdResources: createdResources
      }}
    >
      {({ data, loading }: any) => {
        return (
          <>
            <div id="fhir-attributes">
              <div id="resource-selector">
                <ResourceSelector
                  availableResources={data ? data.availableResources : []}
                  loading={loading}
                  deleteResourceCallback={() => {
                    setCreatedResources(createdResources - 1);
                  }}
                />
              </div>
              <div id="fhir-resource-tree">
                {selectedNode.resource.fhirType ? (
                  <Query
                    fetchPolicy={"network-only"}
                    query={resourceAttributeTree}
                    variables={{
                      createdProfiles: createdProfiles,
                      resourceId: selectedNode.resource.id
                    }}
                    skip={!selectedNode.source || !selectedNode.resource.id}
                  >
                    {({ data, loading }: any) => {
                      return loading ? (
                        <Spinner />
                      ) : (
                        <FhirResourceTree
                          addProfileCallback={(response: any) => {
                            setCreatedProfiles(createdProfiles + 1);
                          }}
                          deleteProfileCallback={(response: any) => {
                            setCreatedProfiles(createdProfiles - 1);
                          }}
                          expandedAttributesIdList={expandedAttributesIdList}
                          nodeCollapseCallback={(node: any) => {
                            setExpandedAttributesIdList(
                              expandedAttributesIdList.filter(
                                (item: any) => item !== node.nodeData.id
                              )
                            );
                          }}
                          nodeExpandCallback={(node: any) => {
                            setExpandedAttributesIdList([
                              ...expandedAttributesIdList,
                              node.nodeData.id
                            ]);
                          }}
                          json={data.resource.attributes}
                          onClickCallback={(nodeData: any) => {
                            dispatch(
                              updateFhirAttribute(nodeData.id, nodeData.name)
                            );
                            updateLocationParams(
                              history,
                              location,
                              "attributeId",
                              nodeData.id
                            );
                          }}
                          selectedNodeId={selectedNode.attribute.id}
                        />
                      );
                    }}
                  </Query>
                ) : null}
              </div>
            </div>
            <div id="resource-add">
              <AddResource
                callback={() => {
                  setCreatedResources(createdResources + 1);
                }}
              />
            </div>
          </>
        );
      }}
    </Query>
  );
};

export default FhirMappingPanel;
