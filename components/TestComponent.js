import gql from 'graphql-tag'
// import {useQuery} from '@apollo/react-hooks'
import {useQuery} from 'react-apollo'
import axios from 'axios'
import {Card, Page,ResourceList, Stack, TextStyle, PageActions, Layout, DisplayText} from '@shopify/polaris'

const GET_COLLECTION_BY_ID = gql`
query getProductsFromCollection($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Collection {
      title
      handle
      id
      products(first:20) {
        edges {
          node {
            id
            title
            tags
            handle
            images(first:1) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
            variants(first:1) {
              edges {
                node{
                  id
                  price
                }
              }
            }
          }
        }
      }
    }
  }
}
`;


function TestComponent (props) {
  const { loading, error, data } = useQuery(GET_COLLECTION_BY_ID, { variables: { ids: props.collectionId } })

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  if (data.nodes[0] === null) {
    window.location.reload();
    return <div></div>
  }

  var productList = data.nodes[0].products.edges
  
  deleteApiData()


  var productListArray = {products: productList, collectionTitle: props.collectionTitle}
  makeApiCall(productListArray)
  async function makeApiCall(productListArray) {
    const url = '/api/products'

    axios.post(url, productListArray)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  function deleteApiData() {
    const url = '/api/products'

    axios.delete(url)
  }

  return (
    <>
    <Layout>
      <Layout.Section>
        <Card title="Cart Page Upsells">
          <ResourceList
              showHeader
              resourceName={{ singular: 'Collection', plural: 'Collections' }}
              items={data.nodes}
              renderItem={item => {
                return (
                  <ResourceList.Item
                    id={item.id}
                    accessibilityLabel={`View details for ${item.title}`}
                  >
                    <Stack>
                      <Stack.Item fill>
                        <h3>
                          <TextStyle variation='strong'>
                            {item.title}
                          </TextStyle>
                        </h3>
                      </Stack.Item>
                    </Stack>
                  </ResourceList.Item>
                )
              }}
            />

        </Card>
      </Layout.Section>
      <Layout.Section>
        <div class='redBtn'>
          <PageActions
              primaryAction={{
                content: 'Remove Collection',
                onAction: () => props.removeCollection()
              }}
              
            />
            </div>
      </Layout.Section>
    </Layout>
    </>
  )
}

export default TestComponent;
