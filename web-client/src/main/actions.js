import { state } from 'cerebral';
import Petition from '../entities/petition';

export const getHello = async ({ api, environment }) => {
  const response = await api.getHello(environment.getBaseUrl());
  return {
    response,
  };
};

export const filePetition = async ({ api, environment }) => {
  const response = await api.filePetition(environment.getBaseUrl());
  return {
    response,
  };
};

export const updatePetition = ({ get }) => {
  const rawPetition = get(state.petition);
  const petition = new Petition(rawPetition);
  return { petition: petition.exportPlainObject() };
};
