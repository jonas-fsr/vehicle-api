import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    setInterval(() => {
      this.getHeatingStatus()
      this.getDoorStatus()
      this.getBatteryStatus()
    }, 5000)
  }

  vehicleObject: any
  isHeatingActive: boolean = false
  isDoorOpen: boolean = false
  isDoorLocked: boolean = false
  isChargingCableConnected: boolean = false
  isCharging: boolean = false
  currentChargingState: number = 0
  startStopCharging: 'START' | 'STOP' = 'START'
  currentAirTemp: number = 0


  title = 'vehicle-api';

  getHeatingStatus() {
    this.http.get('https://t4fayka7ivuinumk3lub4u5npa0tmthn.lambda-url.eu-central-1.on.aws/')
      .subscribe(async (data: any) => {
        let response = await data
        this.isHeatingActive = JSON.parse(response.Vehicle.Cabin.HVAC.IsAirConditioningActive)
        this.currentAirTemp = JSON.parse(response.Vehicle.Cabin.HVAC.AmbientAirTemperature)
      })
  }

  getDoorStatus() {
    this.http.get('https://t4fayka7ivuinumk3lub4u5npa0tmthn.lambda-url.eu-central-1.on.aws/')
      .subscribe(async (data: any) => {
        let doorObject = await data;
        console.log(doorObject)
        this.isDoorLocked = JSON.parse(doorObject.Vehicle.Cabin.Door.Row1.Left.IsLocked)
        this.isDoorOpen = JSON.parse(doorObject.Vehicle.Cabin.Door.Row1.Left.IsOpen)
      })
  }

  getBatteryStatus() {
    this.http.get('https://t4fayka7ivuinumk3lub4u5npa0tmthn.lambda-url.eu-central-1.on.aws/')
      .subscribe(async (data: any) => {
        let batteryObject = await data;
        this.currentChargingState = JSON.parse(batteryObject.Vehicle.Battery.StateOfCharge.Current)
        this.isCharging = JSON.parse(batteryObject.Vehicle.Battery.Charging.IsCharging)
        this.isChargingCableConnected = JSON.parse(batteryObject.Vehicle.Battery.Charging.IsChargingCableConnected)
        this.startStopCharging = batteryObject.Vehicle.Battery.Charging.StartStopCharging
      })
  }

  toggleHeating() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post('https://t4fayka7ivuinumk3lub4u5npa0tmthn.lambda-url.eu-central-1.on.aws/',
      `Vehicle.Cabin.HVAC.IsAirConditioningActive=${!this.isHeatingActive}`,
      {headers, observe: 'response'}
    ).subscribe(response => {
      console.log('toggle heating request returned: ' + response.status)
    })
  }

  toggleDoorLock() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post('https://t4fayka7ivuinumk3lub4u5npa0tmthn.lambda-url.eu-central-1.on.aws/',
      `Vehicle.Cabin.Door.Row1.Left.IsLocked=${!this.isDoorLocked}`,
      {headers, observe: 'response'}
    ).subscribe(response => {
      console.log('toggle door-lock request returned: ' + response.status)
    })
  }

  toggleCharging() {
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    console.log('Vehicle.Battery.Charging.StartStopCharging='.concat(this.startStopCharging == "START" ? "STOP" : "START"))
    this.http.post('https://t4fayka7ivuinumk3lub4u5npa0tmthn.lambda-url.eu-central-1.on.aws/',
      'Vehicle.Battery.Charging.StartStopCharging='.concat(this.startStopCharging == 'START' ? 'STOP' : 'START'),
      {headers, observe: 'response'}).subscribe(response => {
      console.log('toggle charging request returned: ' + response.status)
    })
  }



}
