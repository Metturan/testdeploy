import gql from 'graphql-tag'
import { memo } from 'react';
import {useQuery} from 'react-apollo'
import axios from 'axios'
// import store from 'store';
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


function GiftComponent (props) {
  const { loading, error, data } = useQuery(GET_COLLECTION_BY_ID, { variables: { ids: props.cardCollectionId } })

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  if (data.nodes[0] === null) {
    window.location.reload();
    return <div></div>
  }

  var productList = data.nodes[0].products.edges

  deleteApiData()
  productList.map(product => makeApiCall(product.node))
  var cardListArray = {products: productList, collectionTitle: props.collectionTitle}
  makeApiCall(cardListArray)

  async function makeApiCall(productListArray) {
    const url = '/api/cardProducts'

    axios.post(url, productListArray)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  // async function makeApiCall(products) {
  //   const url = '/api/cardProducts'
  //   axios.post(url, products)
  //     .then(res => console.log(res))
  //     .catch(err => console.log(err))
  // }

  function deleteApiData() {
    const url = '/api/cardProducts'

    axios.delete(url)
  }


  function removeCardCollectionApi() {
    const url = '/api/collectionCard'
    const cardProductsUrl = '/api/cardProducts'

    axios.delete(url)
      .then(res => {
        axios.delete(cardProductsUrl)
          .then(res => {
            window.location.reload();
          })
      })
  }


  return (
    <>
    <Layout>
      <Layout.Section>
        <Card title="Card Collection">
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
          <PageActions
              primaryAction={{
                content: 'Remove Collection',
                onAction: () => removeCardCollectionApi()
              }}
              
            />
      </Layout.Section>
    </Layout>
    </>
  )
}

export default memo(GiftComponent);
