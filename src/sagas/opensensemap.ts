import { call, delay, put, takeEvery } from 'redux-saga/effects';
import {
  LOAD_OSEM_DATA,
  LOAD_OSEM_DATA_FAILED,
  RENDER_OSEM_DATA,
  RENDER_TEMPERATURE_24_DATA,
  RENDER_HUMIDITY_24_DATA,
} from '../actions/opensensemap';

const INTERVAL = 60;

export function* fetchOsemDataPeriodically() {
  while (true) {
    yield call(fetchOsemData);
    yield delay(INTERVAL * 1000);
  }
}

export function* fetchOsemData() {
  try {
    const endpoint =
      'https://api.opensensemap.org/boxes/5d91f4bb5f3de0001ab6bb78/sensors';
    const response = yield call(fetch, endpoint);
    const data = yield response.json();
    yield put({ type: RENDER_OSEM_DATA, osem: data });
  } catch (error) {
    yield put({ type: LOAD_OSEM_DATA_FAILED, error });
  }

  try {
    const endpoint = `https://city-dashboard.felixerdmann.com/opensensemapTemperature24`;
    const response = yield call(fetch, endpoint);
    const data = yield response.json();
    yield put({ type: RENDER_TEMPERATURE_24_DATA, data: data });
  } catch (error) {
    yield put({ type: LOAD_OSEM_DATA_FAILED, error });
  }

  try {
    const endpoint = `https://city-dashboard.felixerdmann.com/opensensemapHumidity24`;
    const response = yield call(fetch, endpoint);
    const data = yield response.json();
    yield put({ type: RENDER_HUMIDITY_24_DATA, data: data });
  } catch (error) {
    yield put({ type: LOAD_OSEM_DATA_FAILED, error });
  }
}

export function* loadOsemData() {
  yield takeEvery(LOAD_OSEM_DATA, fetchOsemDataPeriodically);
}
