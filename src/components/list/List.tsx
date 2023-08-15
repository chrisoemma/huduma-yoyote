import React, { useCallback } from 'react';
import { RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

const List = ({ data, renderItem, refreshCall, refreshing }: any) => {
  const List = styled.FlatList`
    width: ${width - 32}px;
  `;

  const wait = (timeout: number) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    refreshCall();
  }, []);

  return (
    <List
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ width: width }}
      contentContainerStyle={{ paddingBottom: 20 }}
      data={data}
      keyExtractor={(item: any, index) => item.id}
      renderItem={renderItem}
      horizontal={false}

    />
  );
};

export default List;
